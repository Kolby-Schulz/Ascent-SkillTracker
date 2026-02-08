import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import roadmapService from "../services/roadmapService";
import "./CreateRoadmap.css";

const TAG_OPTIONS = [
  "Music",
  "Sports",
  "Arts & Crafts",
  "Languages",
  "Technology",
  "Cooking",
  "Fitness",
  "Photography",
  "Writing",
  "Business",
  "Science",
  "General",
];

const CreateRoadmap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [skillName, setSkillName] = useState("");
  const [tag, setTag] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [subSkills, setSubSkills] = useState([
    {
      id: 1,
      title: "",
      description: "",
      order: 1,
      resources: [],
      customContent: "",
    },
  ]);
  const [errors, setErrors] = useState({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLearnerView, setIsLearnerView] = useState(false);
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [resourceError, setResourceError] = useState("");
  const [loading, setLoading] = useState(!!editId);
  const [loadError, setLoadError] = useState(null);

  // Load roadmap for editing when edit=id in URL
  useEffect(() => {
    if (!editId) return;
    const loadForEdit = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await roadmapService.getMyRoadmapForView(editId);
        const data = res?.data ?? res;
        if (data) {
          setSkillName(data.name || "");
          setTag((data.tags && data.tags[0]) || "");
          const loaded = (data.subSkills || []).map((s, i) => ({
            id: s._id || Date.now() + i,
            title: s.title || "",
            description: s.description || "",
            order: typeof s.order === "number" ? s.order : i + 1,
            resources: (s.resources || []).map((r, j) => ({
              url: r.url || "",
              title: r.title || undefined,
              type: r.type || "other",
              order: typeof r.order === "number" ? r.order : j,
            })),
            customContent: s.customContent || "",
          }));
          if (loaded.length > 0) {
            setSubSkills(loaded);
          }
        }
      } catch (err) {
        console.error("Failed to load roadmap for editing:", err);
        setLoadError(err?.error || err?.message || "Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };
    loadForEdit();
  }, [editId]);

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const detectResourceType = (url) => {
    const lower = url.toLowerCase();
    if (
      lower.includes("youtube.com") ||
      lower.includes("youtu.be") ||
      lower.includes("vimeo.com") ||
      lower.includes("loom.com")
    )
      return "video";
    if (
      lower.includes("article") ||
      lower.includes("blog") ||
      lower.includes("medium.com")
    )
      return "article";
    if (
      lower.includes("practice") ||
      lower.includes("exercise") ||
      lower.includes("codepen")
    )
      return "practice";
    if (lower.includes(".pdf") || lower.includes("docs.google"))
      return "document";
    return "other";
  };

  const nextSlide = () => {
    setIsFlipped(false); // Always show content side when navigating
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === subSkills.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setIsFlipped(false); // Always show content side when navigating
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? subSkills.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index) => {
    setIsFlipped(false); // Always show content side when navigating
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleAddStep = () => {
    const newStep = {
      id: Date.now(),
      title: "",
      description: "",
      order: subSkills.length + 1,
      resources: [],
      customContent: "",
    };
    setSubSkills([...subSkills, newStep]);
    setDirection(1);
    setCurrentIndex(subSkills.length);
    setIsFlipped(false);
  };

  const handleRemoveStep = () => {
    if (subSkills.length === 1) {
      alert("You must have at least one sub-skill");
      return;
    }
    const newSubSkills = subSkills.filter((_, index) => index !== currentIndex);
    const reorderedSkills = newSubSkills.map((skill, index) => ({
      ...skill,
      order: index + 1,
    }));
    setSubSkills(reorderedSkills);
    if (currentIndex >= reorderedSkills.length) {
      setCurrentIndex(reorderedSkills.length - 1);
    }
    setIsFlipped(false);
  };

  const handleTitleChange = (value) => {
    const newSubSkills = [...subSkills];
    newSubSkills[currentIndex].title = value;
    setSubSkills(newSubSkills);
  };

  const handleDescriptionChange = (value) => {
    const newSubSkills = [...subSkills];
    newSubSkills[currentIndex].description = value;
    setSubSkills(newSubSkills);
  };

  const handleCustomContentChange = (value) => {
    const newSubSkills = [...subSkills];
    newSubSkills[currentIndex].customContent = value;
    setSubSkills(newSubSkills);
  };

  const ensureResources = (skill) => {
    return { ...skill, resources: skill.resources || [] };
  };

  const getCurrentResources = () => {
    const skill = ensureResources(subSkills[currentIndex]);
    return skill.resources || [];
  };

  const handleAddResource = () => {
    setResourceError("");
    const url = newResourceUrl.trim();
    if (!url) {
      setResourceError("Please enter a URL");
      return;
    }
    if (!isValidUrl(url)) {
      setResourceError("Please enter a valid URL (e.g. https://...)");
      return;
    }
    const newSubSkills = [...subSkills];
    const current = ensureResources(newSubSkills[currentIndex]);
    const resources = [...(current.resources || [])];
    resources.push({
      url,
      title: newResourceTitle.trim() || null,
      type: detectResourceType(url),
      order: resources.length,
    });
    newSubSkills[currentIndex] = { ...current, resources };
    setSubSkills(newSubSkills);
    setNewResourceUrl("");
    setNewResourceTitle("");
  };

  const handleRemoveResource = (resourceIndex) => {
    const newSubSkills = [...subSkills];
    const current = ensureResources(newSubSkills[currentIndex]);
    const resources = (current.resources || []).filter(
      (_, i) => i !== resourceIndex,
    );
    newSubSkills[currentIndex] = { ...current, resources };
    setSubSkills(newSubSkills);
  };

  const validateRoadmap = () => {
    const newErrors = {};

    if (!skillName.trim()) {
      newErrors.skillName = "Skill name is required";
    }

    if (!tag || !tag.trim()) {
      newErrors.tag = "Tag is required";
    }

    const hasEmptySubSkill = subSkills.some(
      (skill) => !skill.title.trim() || !skill.description.trim(),
    );

    if (hasEmptySubSkill) {
      newErrors.subSkills =
        "All sub-skill titles and descriptions are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildRoadmapPayload = () => {
    const tagTrimmed = tag.trim();
    return {
      name: skillName.trim(),
      description: "",
      tags: tagTrimmed ? [tagTrimmed] : [],
      subSkills: subSkills.map((skill, index) => {
        const order = typeof skill.order === "number" ? skill.order : index + 1;
        const resources = (skill.resources || [])
          .filter((r) => r.url && isValidUrl(r.url))
          .map((r, i) => ({
            url: r.url.trim(),
            title: r.title?.trim() || undefined,
            type: r.type || "other",
            order: typeof r.order === "number" ? r.order : i,
          }));
        return {
          title: (skill.title || "").trim(),
          description: (skill.description || "").trim(),
          order,
          customContent: (skill.customContent || "").trim() || undefined,
          resources,
        };
      }),
      status: "draft",
    };
  };

  const getErrorMessage = (error) => {
    if (!error) return "Something went wrong. Please try again.";
    if (typeof error === "string") return error;
    if (error.error) return error.error;
    if (error.errors && Array.isArray(error.errors) && error.errors[0]?.msg) {
      return error.errors[0].msg;
    }
    if (error.message) return error.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.errors?.[0]?.msg)
      return error.response.data.errors[0].msg;
    if (error.response?.status === 401) return "Please log in again.";
    if (error.response?.status === 404)
      return "API not found. Is the backend running?";
    if (error.code === "ERR_NETWORK")
      return (
        "Cannot reach the server. Is the backend running at " +
        (process.env.REACT_APP_API_URL || "http://localhost:5000") +
        "?"
      );
    return "Something went wrong. Please try again.";
  };

  const handleSaveDraft = async () => {
    if (!validateRoadmap()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const roadmapData = { ...buildRoadmapPayload(), status: "draft" };
      if (editId) {
        await roadmapService.updateRoadmap(editId, roadmapData);
        alert("Draft updated successfully!");
      } else {
        await roadmapService.createRoadmap(roadmapData);
        alert("Draft saved successfully!");
      }
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(getErrorMessage(error));
    }
  };

  const handlePublish = async () => {
    if (!validateRoadmap()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const roadmapData = { ...buildRoadmapPayload(), status: "published" };
      if (editId) {
        await roadmapService.updateRoadmap(editId, roadmapData);
        alert("Roadmap updated and published!");
      } else {
        await roadmapService.createRoadmap(roadmapData);
        alert("Roadmap published successfully!");
      }
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Error publishing roadmap:", error);
      alert(getErrorMessage(error));
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all changes?")) {
      setSkillName("");
      setTag("");
      setSubSkills([
        {
          id: Date.now(),
          title: "",
          description: "",
          order: 1,
          resources: [],
          customContent: "",
        },
      ]);
      setCurrentIndex(0);
      setErrors({});
      setIsFlipped(false);
      setNewResourceUrl("");
      setNewResourceTitle("");
    }
  };

  const resourcesCount = subSkills.filter(
    (s) => (s.resources || []).length > 0,
  ).length;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="create-roadmap-wrapper">
        <div className="create-roadmap-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading roadmap for editing...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="create-roadmap-wrapper">
        <div className="create-roadmap-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="error-message">{loadError}</p>
          <button onClick={() => navigate('/dashboard/profile')} className="back-button">
            ← Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-roadmap-wrapper">
      <motion.div
        className="create-roadmap-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Sub-skills Carousel with Flip */}
        <motion.div
          className="carousel-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="carousel-title-section">
            <input
              type="text"
              className={`skill-name-input ${errors.skillName ? "error" : ""}`}
              placeholder="Enter your skill name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              maxLength={50}
              disabled={isLearnerView}
            />
            {errors.skillName && (
              <span className="error-message">{errors.skillName}</span>
            )}
            <select
              className={`skill-tag-select ${errors.tag ? "error" : ""}`}
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                if (errors.tag) setErrors((prev) => ({ ...prev, tag: undefined }));
              }}
              disabled={isLearnerView}
              aria-label="Select a tag (required)"
            >
              <option value="">(Select Tag)</option>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.tag && (
              <span className="error-message">{errors.tag}</span>
            )}
          </div>
          {errors.subSkills && !isLearnerView && (
            <p className="error-message">{errors.subSkills}</p>
          )}

          <div className="carousel-container">
            {/* Navigation Buttons */}
            <button
              className="carousel-button carousel-button-left"
              onClick={prevSlide}
              aria-label="Previous sub-skill"
            >
              ‹
            </button>

            {/* Flip Card Container - Single rotating container, one flip */}
            <div className="flip-card-container">
              <motion.div
                className="flip-card-inner"
                animate={{ rotateY: isFlipped ? -180 : 0 }}
                transition={{
                  duration: 0.95,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: isFlipped ? 0 : 0.8,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="flip-card-face flip-card-front"
                  style={{
                    transform: "rotateY(0deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      className="carousel-card"
                    >
                      <div className="carousel-card-header">
                        <div className="carousel-card-header-left">
                          <span className="sub-skill-number">
                            Step {subSkills[currentIndex].order}
                          </span>
                          <span className="sub-skill-total">
                            of {subSkills.length}
                          </span>
                          {getCurrentResources().length > 0 && (
                            <span className="resource-count-badge">
                              {getCurrentResources().length} resource
                              {getCurrentResources().length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        {!isLearnerView && (
                          <button
                            type="button"
                            className="resources-header-button"
                            onClick={() => setIsFlipped(true)}
                            title="Add or edit resources"
                          >
                            Add Resources
                          </button>
                        )}
                      </div>

                      {isLearnerView ? (
                        /* Learner View: Read-only */
                        <>
                          <h3 className="sub-skill-title-display">
                            {subSkills[currentIndex].title || "Untitled Step"}
                          </h3>
                          <p className="sub-skill-description-display">
                            {subSkills[currentIndex].description ||
                              "No description provided."}
                          </p>

                          {(
                            subSkills[currentIndex].customContent || ""
                          ).trim() && (
                            <div className="learner-custom-content">
                              <p>{subSkills[currentIndex].customContent}</p>
                            </div>
                          )}

                          {getCurrentResources().length > 0 && (
                            <div className="learner-resources">
                              <div className="learner-free-resources-header">
                                <span className="learner-free-resources-pill">
                                  Resources
                                </span>
                              </div>
                              <div className="learner-resources-list">
                                {getCurrentResources().map((res, idx) => (
                                  <a
                                    key={idx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="learner-resource-item"
                                  >
                                    <span
                                      className={`learner-resource-type-tag learner-resource-type-${res.type}`}
                                    >
                                      {res.type}
                                    </span>
                                    <span className="learner-resource-text">
                                      {res.title || res.url}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        /* Creator View: Editable */
                        <>
                          <input
                            type="text"
                            className="sub-skill-title-input"
                            placeholder="e.g. Holding the guitar and pick"
                            value={subSkills[currentIndex].title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            maxLength={100}
                          />

                          <textarea
                            className="sub-skill-description-input"
                            placeholder="e.g. Learn proper posture and how to hold the guitar and pick correctly"
                            value={subSkills[currentIndex].description}
                            onChange={(e) =>
                              handleDescriptionChange(e.target.value)
                            }
                            maxLength={300}
                            rows={4}
                          />

                          <div className="card-actions">
                            <button
                              className="remove-step-button"
                              onClick={handleRemoveStep}
                              disabled={subSkills.length === 1}
                              title="Remove this step"
                            >
                              🗑️ Remove Step
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.div
                  className="flip-card-face flip-card-back resources-floating-window"
                  initial={{ rotateY: 180 }}
                  animate={{
                    rotateY: 180,
                  }}
                  transition={{
                    rotateY: { duration: 0 },
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="resources-page resources-page-scroll">
                    <button
                      type="button"
                      className="back-to-content-button resources-header-button"
                      onClick={() => setIsFlipped(false)}
                    >
                      ← Back to Content
                    </button>

                    {/* Resources - pill header + add resource + link list only */}
                    <div className="free-resources-header">
                      <span className="free-resources-pill">
                        Resources
                      </span>
                      <span className="free-resources-line" />
                    </div>

                    {/* All links and stuff below Resources */}
                    <div className="resources-list-section">
                      <div className="add-resource-section">
                        <input
                          type="url"
                          className="resource-url-input-main"
                          placeholder="Paste URL here (e.g. https://youtube.com/...)"
                          value={newResourceUrl}
                          onChange={(e) => {
                            setNewResourceUrl(e.target.value);
                            setResourceError("");
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddResource();
                            }
                          }}
                        />
                        <input
                          type="text"
                          className="resource-title-input-main"
                          placeholder="Title (displays as the link text for learners)"
                          value={newResourceTitle}
                          onChange={(e) => setNewResourceTitle(e.target.value)}
                          maxLength={100}
                        />
                        <button
                          type="button"
                          className="add-resource-button-main"
                          onClick={handleAddResource}
                        >
                          Add Resource
                        </button>
                      </div>

                      {resourceError && (
                        <p className="resource-error-main">{resourceError}</p>
                      )}

                      {getCurrentResources().length === 0 ? (
                        <p className="resources-empty-main">
                          No resources yet. Paste a URL and add a title above to
                          get started.
                        </p>
                      ) : (
                        <div className="resources-list-main">
                          {getCurrentResources().map((res, idx) => (
                            <div key={idx} className="resource-item-main">
                              <span
                                className={`resource-type-tag resource-type-${res.type}`}
                              >
                                {res.type}
                              </span>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resource-link-display"
                              >
                                {res.title || res.url}
                              </a>
                              <button
                                className="resource-remove-main"
                                onClick={() => handleRemoveResource(idx)}
                                title="Remove"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <button
              className="carousel-button carousel-button-right"
              onClick={nextSlide}
              aria-label="Next sub-skill"
            >
              ›
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {subSkills.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to sub-skill ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Info */}
          {!isLearnerView && (
            <div className="progress-info">
              <p>
                Viewing sub-skill {currentIndex + 1} of {subSkills.length}
              </p>
              <button className="add-step-button" onClick={handleAddStep}>
                Add New Step
              </button>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        {!isLearnerView && (
          <div className="action-buttons">
            <button className="clear-button" onClick={handleClear}>
              Clear All
            </button>
            <div className="save-publish-buttons">
              <button className="save-draft-button" onClick={handleSaveDraft}>
                💾 Save Draft
              </button>
              <button className="publish-button" onClick={handlePublish}>
                🚀 Publish
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRoadmap;
