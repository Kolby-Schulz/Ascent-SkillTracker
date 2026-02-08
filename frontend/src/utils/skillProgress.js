/**
 * Skill progress utilities - reads from localStorage (skill-progress-${skillId})
 * to determine completion status. Must match how SkillDetail stores progress.
 */

const STORAGE_KEY_COMPLETED_IDS = 'metrics-completed-ids';

function getCompletedIdsSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_IDS);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function setCompletedIdsSet(idsSet) {
  localStorage.setItem(STORAGE_KEY_COMPLETED_IDS, JSON.stringify([...idsSet]));
}

/**
 * Record a built-in skill as completed (all steps done). Persists so metrics never decrease when a card is removed.
 * @param {string} skillId - e.g. 'guitar', 'web-development'
 */
export function recordCompletedSkill(skillId) {
  if (!skillId) return;
  const key = `skill:${skillId}`;
  const set = getCompletedIdsSet();
  set.add(key);
  setCompletedIdsSet(set);
}

/**
 * Record a user-created roadmap as completed. Persists so metrics never decrease when a card is removed.
 * @param {string} roadmapId - MongoDB id or roadmap id
 */
export function recordCompletedRoadmap(roadmapId) {
  if (!roadmapId) return;
  const key = `roadmap:${roadmapId}`;
  const set = getCompletedIdsSet();
  set.add(key);
  setCompletedIdsSet(set);
}

/**
 * Get total number of skills/roadmaps ever completed (persistent; not affected by removing cards).
 * @returns {number}
 */
export function getTotalCompletedCount() {
  return getCompletedIdsSet().size;
}

const SKILL_NAME_TO_ID = {
  'Guitar': 'guitar',
  'Fishing': 'fishing',
  'Singing': 'singing',
  'Web Development': 'web-development',
  'Photography': 'photography',
  'Cooking': 'cooking',
};

// Step count per skillId (must match skillsData in SkillDetail)
const SKILL_STEP_COUNTS = {
  guitar: 6,
  'web-development': 6,
  photography: 6,
};

export function getSkillId(skillName) {
  return SKILL_NAME_TO_ID[skillName] ?? skillName?.toLowerCase().replace(/\s+/g, '-') ?? '';
}

function getStepCount(skillId) {
  return SKILL_STEP_COUNTS[skillId] ?? 0;
}

/**
 * Get completion status for a skill by name.
 * @param {string} skillName - Display name (e.g. 'Guitar')
 * @returns {'completed'|'in-progress'|'not-started'}
 */
export function getSkillStatus(skillName) {
  const skillId = getSkillId(skillName);
  const totalSteps = getStepCount(skillId);
  if (totalSteps === 0) return 'not-started';

  const raw = localStorage.getItem(`skill-progress-${skillId}`);
  const completedSteps = raw ? JSON.parse(raw) : {};
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  if (completedCount === totalSteps) return 'completed';
  if (completedCount > 0) return 'in-progress';
  return 'not-started';
}

/**
 * Get completion status for a user-created roadmap (stored in roadmap-progress-${roadmapId}).
 * @param {string} roadmapId
 * @returns {'completed'|'in-progress'|'not-started'}
 */
export function getRoadmapStatus(roadmapId) {
  if (!roadmapId) return 'not-started';
  const totalRaw = localStorage.getItem(`roadmap-total-steps-${roadmapId}`);
  const totalSteps = totalRaw ? parseInt(totalRaw, 10) : 0;
  if (totalSteps === 0) return 'not-started';

  const raw = localStorage.getItem(`roadmap-progress-${roadmapId}`);
  const completedSteps = raw ? JSON.parse(raw) : {};
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  if (completedCount === totalSteps) return 'completed';
  if (completedCount > 0) return 'in-progress';
  return 'not-started';
}

/**
 * Get learned and in-progress counts for a list of skill names.
 * Includes both built-in skills (skill-progress-*) and user-created roadmaps (roadmap-progress-*).
 * @param {string[]} skillNames
 * @param {(name: string) => string | null} [getRoadmapId] - optional; if provided, skills with a roadmapId use roadmap progress
 * @returns {{ learned: number, inProgress: number }}
 */
export function getSkillsProgressCounts(skillNames, getRoadmapId) {
  let learned = 0;
  let inProgress = 0;
  for (const name of skillNames || []) {
    const roadmapId = typeof getRoadmapId === 'function' ? getRoadmapId(name) : null;
    const status = roadmapId
      ? getRoadmapStatus(roadmapId)
      : getSkillStatus(name);
    if (status === 'completed') learned += 1;
    else if (status === 'in-progress') inProgress += 1;
  }
  return { learned, inProgress };
}

/**
 * Get status for a skill (built-in or roadmap).
 * @param {string} skillName
 * @param {(name: string) => string | null} [getRoadmapId]
 * @returns {'completed'|'in-progress'|'not-started'}
 */
export function getSkillOrRoadmapStatus(skillName, getRoadmapId) {
  const roadmapId = typeof getRoadmapId === 'function' ? getRoadmapId(skillName) : null;
  return roadmapId ? getRoadmapStatus(roadmapId) : getSkillStatus(skillName);
}

/**
 * Sort skill names so completed are at the end, then in-progress, then not-started.
 * @param {string[]} skillNames
 * @param {(name: string) => string | null} [getRoadmapId] - optional; if provided, roadmap completion is used for sorting
 * @returns {string[]}
 */
export function sortSkillsWithCompletedAtEnd(skillNames, getRoadmapId) {
  return [...(skillNames || [])].sort((a, b) => {
    const aStatus = getSkillOrRoadmapStatus(a, getRoadmapId);
    const bStatus = getSkillOrRoadmapStatus(b, getRoadmapId);
    const order = { 'not-started': 0, 'in-progress': 1, completed: 2 };
    return (order[aStatus] ?? 0) - (order[bStatus] ?? 0);
  });
}
