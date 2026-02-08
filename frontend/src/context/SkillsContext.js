import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import userSkillService from '../services/userSkillService';

const SkillsContext = createContext();

const STORAGE_KEY_PREFIX_SKILLS = 'user-skills-list-';
const STORAGE_KEY_PREFIX_ROADMAP_IDS = 'user-skills-roadmap-ids-';

const getStorageKeys = (userId) => {
  const suffix = userId || 'anon';
  return {
    skills: `${STORAGE_KEY_PREFIX_SKILLS}${suffix}`,
    roadmapIds: `${STORAGE_KEY_PREFIX_ROADMAP_IDS}${suffix}`,
  };
};

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
  const { user } = useAuth();
  const userId = user?.id;

  const [skills, setSkillsState] = useState([]);
  const [roadmapIdsBySkillName, setRoadmapIdsBySkillName] = useState({});

  // Load this user's skills from backend (source of truth) when user changes; fallback to localStorage only if API fails
  useEffect(() => {
    if (!userId) {
      setSkillsState([]);
      setRoadmapIdsBySkillName({});
      return;
    }
    const { skills: skillsKey, roadmapIds: roadmapIdsKey } = getStorageKeys(userId);
    const storedRoadmapIds = loadStored(roadmapIdsKey, {});

    const loadSkills = async () => {
      try {
        const res = await userSkillService.getMyProgress();
        const progress = res?.data?.data?.progress;
        const skillNames = Array.isArray(progress) ? progress.map((p) => p.skillName) : [];
        setSkillsState(skillNames);
        localStorage.setItem(skillsKey, JSON.stringify(skillNames));
      } catch {
        const stored = loadStored(skillsKey, null);
        setSkillsState(Array.isArray(stored) ? stored : []);
      }
      setRoadmapIdsBySkillName(storedRoadmapIds && typeof storedRoadmapIds === 'object' ? storedRoadmapIds : {});
    };

    loadSkills();
  }, [userId]);

  const setSkills = (newSkills) => {
    setSkillsState(newSkills);
    if (userId) {
      const { skills: key } = getStorageKeys(userId);
      localStorage.setItem(key, JSON.stringify(newSkills));
    }
  };

  const addSkill = (skillName, roadmapId) => {
    if (!skillName) return;
    if (skills.includes(skillName)) {
      if (roadmapId) {
        setRoadmapIdsBySkillName((prev) => {
          const next = { ...prev, [skillName]: roadmapId };
          if (userId) {
            const { roadmapIds: key } = getStorageKeys(userId);
            localStorage.setItem(key, JSON.stringify(next));
          }
          return next;
        });
      }
      return;
    }
    setSkills([...skills, skillName]);
    if (roadmapId) {
      setRoadmapIdsBySkillName((prev) => {
        const next = { ...prev, [skillName]: roadmapId };
        if (userId) {
          const { roadmapIds: key } = getStorageKeys(userId);
          localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
    }
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter((skill) => skill !== skillName));
    setRoadmapIdsBySkillName((prev) => {
      const next = { ...prev };
      delete next[skillName];
      if (userId) {
        const { roadmapIds: key } = getStorageKeys(userId);
        localStorage.setItem(key, JSON.stringify(next));
      }
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
