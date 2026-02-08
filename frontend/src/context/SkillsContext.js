import React, { createContext, useState, useContext } from 'react';

const SkillsContext = createContext();

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
};

export const SkillsProvider = ({ children }) => {
  const [skills, setSkills] = useState(['Guitar', 'Fishing', 'Singing']);

  const addSkill = (skillName) => {
    if (skillName && !skills.includes(skillName)) {
      setSkills([...skills, skillName]);
    }
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter(skill => skill !== skillName));
  };

  const reorderSkills = (newSkills) => {
    setSkills(newSkills);
  };

  const value = {
    skills,
    addSkill,
    removeSkill,
    reorderSkills,
  };

  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>;
};

export default SkillsContext;
