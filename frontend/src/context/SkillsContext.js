import React, { createContext, useState, useContext } from 'react';

const SkillsContext = createContext();

const STORAGE_KEY_SKILLS = 'user-skills-list';
const STORAGE_KEY_ROADMAP_IDS = 'user-skills-roadmap-ids';

const loadStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
};

export const SkillsProvider = ({ children }) => {
  const [skills, setSkillsState] = useState(() =>
    loadStored(STORAGE_KEY_SKILLS, ['Guitar', 'Web Development', 'Photography'])
  );
  const [roadmapIdsBySkillName, setRoadmapIdsBySkillName] = useState(() =>
    loadStored(STORAGE_KEY_ROADMAP_IDS, {})
  );

  const setSkills = (newSkills) => {
    setSkillsState(newSkills);
    localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(newSkills));
  };

  const addSkill = (skillName, roadmapId) => {
    if (!skillName) return;
    if (skills.includes(skillName)) {
      if (roadmapId) {
        setRoadmapIdsBySkillName((prev) => {
          const next = { ...prev, [skillName]: roadmapId };
          localStorage.setItem(STORAGE_KEY_ROADMAP_IDS, JSON.stringify(next));
          return next;
        });
      }
      return;
    }
    setSkills([...skills, skillName]);
    if (roadmapId) {
      setRoadmapIdsBySkillName((prev) => {
        const next = { ...prev, [skillName]: roadmapId };
        localStorage.setItem(STORAGE_KEY_ROADMAP_IDS, JSON.stringify(next));
        return next;
      });
    }
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter((skill) => skill !== skillName));
    setRoadmapIdsBySkillName((prev) => {
      const next = { ...prev };
      delete next[skillName];
      localStorage.setItem(STORAGE_KEY_ROADMAP_IDS, JSON.stringify(next));
      return next;
    });
  };

  const reorderSkills = (newSkills) => {
    setSkills(newSkills);
  };

  const getRoadmapId = (skillName) => roadmapIdsBySkillName[skillName] || null;

  const value = {
    skills,
    addSkill,
    removeSkill,
    reorderSkills,
    getRoadmapId,
  };

  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>;
};

export default SkillsContext;
