import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addItem,
  deleteItem,
  getPortfolioData,
  saveSection,
  updateItem,
} from "../firebase/database";

import { logoutAdmin } from "../firebase/auth";
import { uploadFile } from "../firebase/storage";

import "../styles/admin.css";
import { calculateExperience } from "./experience";

const emptyProject = {
  title: "",
  category: "",
  description: "",
  technologies: "",
  url: "",
  imageUrl: "",
};

const emptySkill = {
  name: "",
  category: "",
  description: "",
};

const emptyExperience = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function Admin({ user }) {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");

  const [skillForm, setSkillForm] = useState(emptySkill);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [experienceForm, setExperienceForm] =
    useState(emptyExperience);

  const [editingSkill, setEditingSkill] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingExperience, setEditingExperience] =
    useState(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileImageSource, setProfileImageSource] =
  useState("file");

const [resumeSource, setResumeSource] =
  useState("file");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const result = await getPortfolioData();

      setData(result || {});
    } catch (error) {
      console.error("Admin data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalSection = (section, value) => {
    setData((previous) => ({
      ...previous,
      [section]: value,
    }));
  };

  const saveSectionData = async (section) => {
    try {
      setSaving(true);

      await saveSection(
        section,
        data[section] || {}
      );

      showToast(`${capitalize(section)} saved successfully.`);
    } catch (error) {
      console.error(error);
      showToast("Failed to save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getGoogleDriveFileId = (url) => {
  if (!url) return "";

  const match = url.match(
    /\/d\/([a-zA-Z0-9_-]+)/
  );

  if (match?.[1]) {
    return match[1];
  }

  const idMatch = url.match(
    /[?&]id=([a-zA-Z0-9_-]+)/
  );

  return idMatch?.[1] || "";
};

const getDriveImageUrl = (url) => {
  const fileId = getGoogleDriveFileId(url);

  if (!fileId) return url;

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

  const showToast = (message, type = "success") => {
    // Simple browser notification for now.
    // Can easily be replaced with a toast library later.
    if (type === "error") {
      window.alert(message);
      return;
    }

    window.alert(message);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  const handleFileUpload = async (
    event,
    folder,
    callback
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(folder);

      const url = await uploadFile(file, folder);

      callback(url);

      showToast("File uploaded successfully.");
    } catch (error) {
      console.error(error);
      showToast("Upload failed.", "error");
    } finally {
      setUploading("");
      event.target.value = "";
    }
  };

  // --------------------------------
  // PROFILE
  // --------------------------------

  const profile = data.profile || {};

  const updateProfile = (field, value) => {
    updateLocalSection("profile", {
      ...profile,
      [field]: value,
    });
  };

  // --------------------------------
  // ABOUT
  // --------------------------------

  const about = data.about || {};

  const updateAbout = (field, value) => {
    updateLocalSection("about", {
      ...about,
      [field]: value,
    });
  };

  // --------------------------------
  // CONTACT
  // --------------------------------

  const contact = data.contact || {};

  const updateContact = (field, value) => {
    updateLocalSection("contact", {
      ...contact,
      [field]: value,
    });
  };

  // --------------------------------
  // SETTINGS
  // --------------------------------

  const settings = {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    contact: true,
    ...(data.settings || {}),
  };

  const updateSetting = (field, value) => {
    updateLocalSection("settings", {
      ...settings,
      [field]: value,
    });
  };

  // --------------------------------
  // SKILLS
  // --------------------------------

  const skills = useMemo(
    () => Object.entries(data.skills || {}),
    [data.skills]
  );

  const resetSkill = () => {
    setSkillForm(emptySkill);
    setEditingSkill(null);
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();

    if (!skillForm.name.trim()) {
      showToast("Skill name is required.", "error");
      return;
    }

    try {
      setSaving(true);

      if (editingSkill) {
        await updateItem(
          "skills",
          editingSkill,
          skillForm
        );
      } else {
        await addItem("skills", skillForm);
      }

      await loadData();
      resetSkill();
      showToast(
        editingSkill
          ? "Skill updated successfully."
          : "Skill added successfully."
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to save skill.", "error");
    } finally {
      setSaving(false);
    }
  };

  const editSkill = (id, item) => {
    setEditingSkill(id);

    setSkillForm({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
    });
  };

  const removeSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await deleteItem("skills", id);
      await loadData();
      showToast("Skill deleted.");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete skill.", "error");
    }
  };

  // --------------------------------
  // PROJECTS
  // --------------------------------

  const projects = useMemo(
    () => Object.entries(data.projects || {}),
    [data.projects]
  );

  const resetProject = () => {
    setProjectForm(emptyProject);
    setEditingProject(null);
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();

    if (!projectForm.title.trim()) {
      showToast("Project title is required.", "error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...projectForm,
        technologies: projectForm.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingProject) {
        await updateItem(
          "projects",
          editingProject,
          payload
        );
      } else {
        await addItem("projects", payload);
      }

      await loadData();
      resetProject();

      showToast(
        editingProject
          ? "Project updated successfully."
          : "Project added successfully."
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to save project.", "error");
    } finally {
      setSaving(false);
    }
  };

  const editProject = (id, item) => {
    setEditingProject(id);

    setProjectForm({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : "",
      url: item.url || "",
      imageUrl: item.imageUrl || "",
    });
  };

  const removeProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteItem("projects", id);
      await loadData();
      showToast("Project deleted.");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete project.", "error");
    }
  };

  // --------------------------------
  // EXPERIENCE
  // --------------------------------

  const experiences = useMemo(
    () => Object.entries(data.experience || {}),
    [data.experience]
  );

  const resetExperience = () => {
    setExperienceForm(emptyExperience);
    setEditingExperience(null);
  };

  const handleExperienceSubmit = async (event) => {
    event.preventDefault();

    if (!experienceForm.company.trim()) {
      showToast("Company is required.", "error");
      return;
    }

    try {
      setSaving(true);

      if (editingExperience) {
        await updateItem(
          "experience",
          editingExperience,
          experienceForm
        );
      } else {
        await addItem(
          "experience",
          experienceForm
        );
      }

      await loadData();
      resetExperience();

      showToast(
        editingExperience
          ? "Experience updated successfully."
          : "Experience added successfully."
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to save experience.", "error");
    } finally {
      setSaving(false);
    }
  };

  const editExperience = (id, item) => {
    setEditingExperience(id);

    setExperienceForm({
      company: item.company || "",
      position: item.position || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      description: item.description || "",
    });
  };

  const removeExperience = async (id) => {
    if (!window.confirm("Delete this experience?")) return;

    try {
      await deleteItem("experience", id);
      await loadData();
      showToast("Experience deleted.");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete experience.", "error");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loader" />
        <span>Loading your workspace...</span>
      </div>
    );
  }

  const navGroups = [
    {
      title: "Overview",
      items: [
        ["dashboard", "Dashboard", "⌂"],
      ],
    },
    {
      title: "Content",
      items: [
        ["profile", "Profile", "◉"],
        ["about", "About", "◎"],
        ["skills", "Skills", "✦"],
        ["projects", "Projects", "▣"],
        ["experience", "Experience", "◷"],
      ],
    },
    {
      title: "Communication",
      items: [
        ["contact", "Contact", "✉"],
      ],
    },
    {
      title: "System",
      items: [
        ["settings", "Settings", "⚙"],
      ],
    },
  ];

  return (
    <div className="admin-layout">

      {/* MOBILE TOPBAR */}

      <div className="admin-mobile-topbar">
        <button
          className="admin-mobile-menu"
          onClick={() =>
            setMobileNavOpen((value) => !value)
          }
        >
          ☰
        </button>

        <div className="admin-mobile-logo">
          RN.
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="admin-mobile-preview"
        >
          ↗
        </a>
      </div>

      {/* SIDEBAR */}

      <aside
        className={`admin-sidebar ${
          mobileNavOpen ? "mobile-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-mark">
            RN.
          </div>

          <div>
            <strong>PORTFOLIO</strong>
            <span>ADMIN CMS</span>
          </div>
        </div>

        <div className="admin-sidebar-label">
          WORKSPACE
        </div>

        <nav className="admin-nav">
          {navGroups.map((group) => (
            <div
              className="admin-nav-group"
              key={group.title}
            >
              <div className="admin-nav-group-title">
                {group.title}
              </div>

              {group.items.map(
                ([key, label, icon]) => (
                  <AdminNavItem
                    key={key}
                    label={label}
                    icon={icon}
                    active={activeTab === key}
                    onClick={() => {
                      setActiveTab(key);
                      setMobileNavOpen(false);
                    }}
                  />
                )
              )}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {user?.email?.charAt(0)?.toUpperCase() ||
                "A"}
            </div>

            <div className="admin-user-info">
              <strong>Administrator</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <div className="admin-breadcrumb">
              Portfolio
              <span>/</span>
              {activeTab === "dashboard"
                ? "Dashboard"
                : capitalize(activeTab)}
            </div>

            <h1>
              {activeTab === "dashboard"
                ? "Dashboard"
                : capitalize(activeTab)}
            </h1>

            <p>
              {getPageDescription(activeTab)}
            </p>
          </div>

          <div className="admin-header-actions">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-preview"
            >
              Preview Portfolio
              <span>↗</span>
            </a>
          </div>
        </header>

        {/* DASHBOARD */}

        {activeTab === "dashboard" && (
          <Dashboard
            data={data}
            setActiveTab={setActiveTab}
          />
        )}

        {/* PROFILE */}

        {activeTab === "profile" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="Personal Information"
              title="Profile"
              description="Manage the main information visitors see on your portfolio."
            />

            <AdminCard
              title="Basic Information"
              description="These details appear across your hero section and portfolio header."
            >
              <div className="admin-grid">
                <AdminInput
                  label="Greeting"
                  helper="Text shown before your name."
                  value={profile.greeting}
                  placeholder="Hi, I'm"
                  onChange={(value) =>
                    updateProfile(
                      "greeting",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Name"
                  helper="Your public display name."
                  value={profile.name}
                  placeholder="Your Name"
                  onChange={(value) =>
                    updateProfile(
                      "name",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Logo"
                  helper="Short text shown in navigation."
                  value={profile.logo}
                  placeholder="RN."
                  onChange={(value) =>
                    updateProfile(
                      "logo",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Position"
                  helper="Your main professional title."
                  value={profile.position}
                  placeholder="React Native Developer"
                  onChange={(value) =>
                    updateProfile(
                      "position",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Current Role"
                  helper="Your current role or designation."
                  value={profile.currentRole}
                  placeholder="Senior Developer"
                  onChange={(value) =>
                    updateProfile(
                      "currentRole",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Availability Status"
                  helper="Example: Available for Work."
                  value={profile.status}
                  placeholder="Available for Work"
                  onChange={(value) =>
                    updateProfile(
                      "status",
                      value
                    )
                  }
                />

               <AdminInput
                label="Career Start Date"
                type="date"
                value={profile.careerStartDate || ""}
                helper="Your experience will be calculated automatically."
                onChange={(value) =>
                    updateProfile("careerStartDate", value)
                }
                />

                <AdminInput
                label="Experience"
                type="text"
                value={
                    calculateExperience(profile.careerStartDate).text
                }
                helper="Automatically calculated from your career start date."
                readOnly
                />

                <AdminInput
                  label="Projects Completed"
                  type="number"
                  value={profile.projectsCompleted}
                  placeholder="50"
                  onChange={(value) =>
                    updateProfile(
                      "projectsCompleted",
                      value
                    )
                  }
                />
              </div>

              <AdminTextarea
                label="Short Bio"
                helper="A short introduction displayed in your hero section."
                value={profile.shortBio}
                placeholder="Tell visitors a little about yourself..."
                onChange={(value) =>
                  updateProfile(
                    "shortBio",
                    value
                  )
                }
              />

              <FormActions
                saving={saving}
                onSave={() =>
                  saveSectionData("profile")
                }
              />
            </AdminCard>

            <div className="admin-two-column">

            <AdminCard
                title="Profile Photo"
                description="Choose whether to upload an image or use a Google Drive link."
              >
                {profile.imageUrl ? (
                  <div className="admin-image-box">
                    <img
                      src={getDriveImageUrl(profile.imageUrl)}
                      alt="Profile"
                    />
                  </div>
                ) : (
                  <UploadPlaceholder
                    icon="◎"
                    title="No profile image"
                    description="Upload an image or add a Google Drive link."
                  />
                )}

                <div className="admin-source-tabs">
                  <button
                    type="button"
                    className={
                      profileImageSource === "file"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setProfileImageSource("file")
                    }
                  >
                    Upload File
                  </button>

                  <button
                    type="button"
                    className={
                      profileImageSource === "link"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setProfileImageSource("link")
                    }
                  >
                    Drive / Link
                  </button>
                </div>

                {profileImageSource === "file" ? (
                  <FileUpload
                    accept="image/*"
                    uploading={
                      uploading === "profile"
                    }
                    onChange={(event) =>
                      handleFileUpload(
                        event,
                        "profile",
                        (url) =>
                          updateProfile(
                            "imageUrl",
                            url
                          )
                      )
                    }
                  />
                ) : (
                  <AdminInput
                    label="Image URL"
                    value={profile.imageUrl || ""}
                    placeholder="https://drive.google.com/file/d/..."
                    helper="Paste a Google Drive sharing link or any public image URL."
                    onChange={(value) =>
                      updateProfile(
                        "imageUrl",
                        value
                      )
                    }
                  />
                )}

                <FormActions
                  saving={saving}
                  onSave={() =>
                    saveSectionData("profile")
                  }
                />
              </AdminCard>

              <AdminCard
              title="Resume"
              description="Choose whether to upload your resume or use a Google Drive link."
            >
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-file-preview"
                >
                  <span>PDF</span>

                  <div>
                    <strong>
                      Current Resume
                    </strong>

                    <small>
                      Open resume ↗
                    </small>
                  </div>
                </a>
              ) : (
                <UploadPlaceholder
                  icon="PDF"
                  title="No resume"
                  description="Upload a PDF/DOC file or add a Google Drive link."
                />
              )}

              <div className="admin-source-tabs">
                <button
                  type="button"
                  className={
                    resumeSource === "file"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setResumeSource("file")
                  }
                >
                  Upload File
                </button>

                <button
                  type="button"
                  className={
                    resumeSource === "link"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setResumeSource("link")
                  }
                >
                  Drive / Link
                </button>
              </div>

              {resumeSource === "file" ? (
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  uploading={
                    uploading === "resume"
                  }
                  onChange={(event) =>
                    handleFileUpload(
                      event,
                      "resume",
                      (url) =>
                        updateProfile(
                          "resumeUrl",
                          url
                        )
                    )
                  }
                />
              ) : (
                <AdminInput
                  label="Resume URL"
                  value={profile.resumeUrl || ""}
                  placeholder="https://drive.google.com/file/d/..."
                  helper="Paste a Google Drive sharing link or public resume URL."
                  onChange={(value) =>
                    updateProfile(
                      "resumeUrl",
                      value
                    )
                  }
                />
              )}

              <FormActions
                saving={saving}
                onSave={() =>
                  saveSectionData("profile")
                }
              />
            </AdminCard>

            </div>
          </section>
        )}

        {/* ABOUT */}

        {activeTab === "about" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="About Your Work"
              title="About Section"
              description="Tell visitors who you are, what you do and what you care about."
            />

            <AdminCard
              title="About Content"
              description="This content appears in the About section of your portfolio."
            >
              <AdminInput
                label="Section Title"
                value={about.title}
                placeholder="Building things that matter."
                onChange={(value) =>
                  updateAbout(
                    "title",
                    value
                  )
                }
              />

              <AdminTextarea
                label="Description"
                helper="Write a clear introduction about yourself and your work."
                value={about.description}
                placeholder="I'm a developer focused on..."
                rows={8}
                onChange={(value) =>
                  updateAbout(
                    "description",
                    value
                  )
                }
              />

              <FormActions
                saving={saving}
                onSave={() =>
                  saveSectionData("about")
                }
              />
            </AdminCard>
          </section>
        )}

        {/* SKILLS */}

        {activeTab === "skills" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="Technical Expertise"
              title="Skills"
              description="Add the technologies, tools and areas you work with."
            />

            <AdminCard
              title={
                editingSkill
                  ? "Edit Skill"
                  : "Add New Skill"
              }
              description={
                editingSkill
                  ? "Update the selected skill."
                  : "Add a skill to your portfolio."
              }
            >
              <form onSubmit={handleSkillSubmit}>

                <div className="admin-grid">

                  <AdminInput
                    label="Skill Name"
                    required
                    value={skillForm.name}
                    placeholder="React Native"
                    onChange={(value) =>
                      setSkillForm({
                        ...skillForm,
                        name: value,
                      })
                    }
                  />

                  <AdminInput
                    label="Category"
                    value={skillForm.category}
                    placeholder="Mobile Development"
                    onChange={(value) =>
                      setSkillForm({
                        ...skillForm,
                        category: value,
                      })
                    }
                  />

                </div>

                <AdminTextarea
                  label="Description"
                  value={
                    skillForm.description
                  }
                  placeholder="Describe your experience with this skill..."
                  onChange={(value) =>
                    setSkillForm({
                      ...skillForm,
                      description:
                        value,
                    })
                  }
                />

                <FormActions
                  submit
                  saving={saving}
                  saveText={
                    editingSkill
                      ? "Update Skill"
                      : "Add Skill"
                  }
                  onCancel={
                    editingSkill
                      ? resetSkill
                      : undefined
                  }
                />

              </form>
            </AdminCard>

            <AdminCard
              title="Your Skills"
              description={`${skills.length} skill${
                skills.length === 1
                  ? ""
                  : "s"
              } added`}
            >
              {skills.length === 0 ? (
                <EmptyState
                  icon="✦"
                  title="No skills yet"
                  text="Add your first skill using the form above."
                />
              ) : (
                <div className="admin-item-grid">

                  {skills.map(
                    ([id, skill]) => (
                      <div
                        key={id}
                        className="admin-content-card"
                      >
                        <div className="admin-content-icon">
                          ✦
                        </div>

                        <div className="admin-content-main">
                          <strong>
                            {skill.name}
                          </strong>

                          {skill.category && (
                            <span>
                              {skill.category}
                            </span>
                          )}

                          {skill.description && (
                            <p>
                              {
                                skill.description
                              }
                            </p>
                          )}
                        </div>

                        <div className="admin-card-actions">
                          <button
                            onClick={() =>
                              editSkill(
                                id,
                                skill
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="danger"
                            onClick={() =>
                              removeSkill(id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}

                </div>
              )}
            </AdminCard>
          </section>
        )}

        {/* PROJECTS */}

        {activeTab === "projects" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="Selected Work"
              title="Projects"
              description="Showcase the work you're most proud of."
            />

            <AdminCard
              title={
                editingProject
                  ? "Edit Project"
                  : "Add New Project"
              }
              description="Add project details, technologies and a project image."
            >
              <form onSubmit={handleProjectSubmit}>

                <div className="admin-grid">

                  <AdminInput
                    label="Project Title"
                    required
                    value={
                      projectForm.title
                    }
                    placeholder="My Awesome App"
                    onChange={(value) =>
                      setProjectForm({
                        ...projectForm,
                        title: value,
                      })
                    }
                  />

                  <AdminInput
                    label="Category"
                    value={
                      projectForm.category
                    }
                    placeholder="Mobile App"
                    onChange={(value) =>
                      setProjectForm({
                        ...projectForm,
                        category:
                          value,
                      })
                    }
                  />

                </div>

                <AdminTextarea
                  label="Description"
                  value={
                    projectForm.description
                  }
                  placeholder="Describe what you built..."
                  rows={6}
                  onChange={(value) =>
                    setProjectForm({
                      ...projectForm,
                      description:
                        value,
                    })
                  }
                />

                <AdminInput
                  label="Technologies"
                  helper="Separate technologies using commas."
                  value={
                    projectForm.technologies
                  }
                  placeholder="React Native, Firebase, Redux"
                  onChange={(value) =>
                    setProjectForm({
                      ...projectForm,
                      technologies:
                        value,
                    })
                  }
                />

                <div className="admin-grid">

                  <AdminInput
                    label="Project URL"
                    value={projectForm.url}
                    placeholder="https://example.com"
                    onChange={(value) =>
                      setProjectForm({
                        ...projectForm,
                        url: value,
                      })
                    }
                  />

                  <AdminInput
                    label="Project Image URL"
                    value={
                      projectForm.imageUrl
                    }
                    placeholder="https://..."
                    onChange={(value) =>
                      setProjectForm({
                        ...projectForm,
                        imageUrl:
                          value,
                      })
                    }
                  />

                </div>

                {projectForm.imageUrl && (
                  <div className="admin-project-preview">
                    <img
                      src={
                        projectForm.imageUrl
                      }
                      alt="Project preview"
                    />
                  </div>
                )}

                <FormActions
                  submit
                  saving={saving}
                  saveText={
                    editingProject
                      ? "Update Project"
                      : "Add Project"
                  }
                  onCancel={
                    editingProject
                      ? resetProject
                      : undefined
                  }
                />

              </form>
            </AdminCard>

            <AdminCard
              title="Your Projects"
              description={`${projects.length} project${
                projects.length === 1
                  ? ""
                  : "s"
              } added`}
            >
              {projects.length === 0 ? (
                <EmptyState
                  icon="▣"
                  title="No projects yet"
                  text="Add your first project using the form above."
                />
              ) : (
                <div className="admin-project-grid">

                  {projects.map(
                    ([id, project]) => (
                      <article
                        key={id}
                        className="admin-project-card"
                      >
                        {project.imageUrl ? (
                          <div className="admin-project-image">
                            <img
                              src={
                                project.imageUrl
                              }
                              alt={
                                project.title
                              }
                            />
                          </div>
                        ) : (
                          <div className="admin-project-image admin-project-placeholder">
                            PROJECT
                          </div>
                        )}

                        <div className="admin-project-content">

                          <span className="admin-card-category">
                            {project.category ||
                              "PROJECT"}
                          </span>

                          <h3>
                            {project.title}
                          </h3>

                          <p>
                            {
                              project.description
                            }
                          </p>

                          {project.technologies?.length >
                            0 && (
                            <div className="admin-tags">
                              {project.technologies.map(
                                (
                                  technology
                                ) => (
                                  <span
                                    key={
                                      technology
                                    }
                                  >
                                    {
                                      technology
                                    }
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          <div className="admin-card-actions">
                            <button
                              onClick={() =>
                                editProject(
                                  id,
                                  project
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="danger"
                              onClick={() =>
                                removeProject(
                                  id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>

                        </div>
                      </article>
                    )
                  )}

                </div>
              )}
            </AdminCard>
          </section>
        )}

        {/* EXPERIENCE */}

        {activeTab === "experience" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="Career History"
              title="Experience"
              description="Keep your professional journey up to date."
            />

            <AdminCard
              title={
                editingExperience
                  ? "Edit Experience"
                  : "Add Experience"
              }
              description="Add your company, role, dates and responsibilities."
            >
              <form
                onSubmit={
                  handleExperienceSubmit
                }
              >

                <div className="admin-grid">

                  <AdminInput
                    label="Company"
                    required
                    value={
                      experienceForm.company
                    }
                    placeholder="Company Name"
                    onChange={(value) =>
                      setExperienceForm({
                        ...experienceForm,
                        company: value,
                      })
                    }
                  />

                  <AdminInput
                    label="Position"
                    value={
                      experienceForm.position
                    }
                    placeholder="React Native Developer"
                    onChange={(value) =>
                      setExperienceForm({
                        ...experienceForm,
                        position:
                          value,
                      })
                    }
                  />

                  <AdminInput
                    label="Start Date"
                    value={
                      experienceForm.startDate
                    }
                    placeholder="Jan 2024"
                    onChange={(value) =>
                      setExperienceForm({
                        ...experienceForm,
                        startDate:
                          value,
                      })
                    }
                  />

                  <AdminInput
                    label="End Date"
                    helper="Leave as Present for your current role."
                    value={
                      experienceForm.endDate
                    }
                    placeholder="Present"
                    onChange={(value) =>
                      setExperienceForm({
                        ...experienceForm,
                        endDate:
                          value,
                      })
                    }
                  />

                </div>

                <AdminTextarea
                  label="Description"
                  value={
                    experienceForm.description
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={7}
                  onChange={(value) =>
                    setExperienceForm({
                      ...experienceForm,
                      description:
                        value,
                    })
                  }
                />

                <FormActions
                  submit
                  saving={saving}
                  saveText={
                    editingExperience
                      ? "Update Experience"
                      : "Add Experience"
                  }
                  onCancel={
                    editingExperience
                      ? resetExperience
                      : undefined
                  }
                />

              </form>
            </AdminCard>

            <AdminCard
              title="Work History"
              description={`${experiences.length} position${
                experiences.length === 1
                  ? ""
                  : "s"
              } added`}
            >
              {experiences.length === 0 ? (
                <EmptyState
                  icon="◷"
                  title="No experience yet"
                  text="Add your first position using the form above."
                />
              ) : (
                <div className="admin-timeline">

                  {experiences.map(
                    ([id, experience]) => (
                      <div
                        className="admin-timeline-item"
                        key={id}
                      >
                        <div className="admin-timeline-dot" />

                        <div className="admin-experience-card">

                          <div className="admin-experience-top">

                            <div>
                              <span className="admin-card-category">
                                {
                                  experience.company
                                }
                              </span>

                              <h3>
                                {
                                  experience.position
                                }
                              </h3>
                            </div>

                            <span className="admin-date">
                              {
                                experience.startDate
                              }{" "}
                              —{" "}
                              {
                                experience.endDate ||
                                  "Present"
                              }
                            </span>

                          </div>

                          {experience.description && (
                            <p>
                              {
                                experience.description
                              }
                            </p>
                          )}

                          <div className="admin-card-actions">
                            <button
                              onClick={() =>
                                editExperience(
                                  id,
                                  experience
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="danger"
                              onClick={() =>
                                removeExperience(
                                  id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>

                        </div>
                      </div>
                    )
                  )}

                </div>
              )}
            </AdminCard>
          </section>
        )}

        {/* CONTACT */}

        {activeTab === "contact" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="Get In Touch"
              title="Contact"
              description="Manage the contact information and social links shown on your portfolio."
            />

            <AdminCard
              title="Contact Information"
              description="Visitors will use these details to reach you."
            >
              <div className="admin-grid">

                <AdminInput
                  label="Email"
                  type="email"
                  value={contact.email}
                  placeholder="hello@example.com"
                  onChange={(value) =>
                    updateContact(
                      "email",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Phone"
                  value={contact.phone}
                  placeholder="+91 98765 43210"
                  onChange={(value) =>
                    updateContact(
                      "phone",
                      value
                    )
                  }
                />

                <AdminInput
                  label="Location"
                  value={
                    contact.location
                  }
                  placeholder="Pune, India"
                  onChange={(value) =>
                    updateContact(
                      "location",
                      value
                    )
                  }
                />

              </div>

              <AdminTextarea
                label="Contact Description"
                value={
                  contact.description
                }
                placeholder="Have an idea, project or opportunity? Drop me a message."
                onChange={(value) =>
                  updateContact(
                    "description",
                    value
                  )
                }
              />

              <FormActions
                saving={saving}
                onSave={() =>
                  saveSectionData(
                    "contact"
                  )
                }
              />
            </AdminCard>

            <AdminCard
              title="Social Links"
              description="Add links to your professional and social profiles."
            >
              <div className="admin-social-grid">

                <AdminInput
                  label="GitHub"
                  value={
                    contact.socials?.github
                  }
                  placeholder="https://github.com/..."
                  onChange={(value) =>
                    updateContact(
                      "socials",
                      {
                        ...contact.socials,
                        github: value,
                      }
                    )
                  }
                />

                <AdminInput
                  label="LinkedIn"
                  value={
                    contact.socials
                      ?.linkedin
                  }
                  placeholder="https://linkedin.com/in/..."
                  onChange={(value) =>
                    updateContact(
                      "socials",
                      {
                        ...contact.socials,
                        linkedin:
                          value,
                      }
                    )
                  }
                />

                <AdminInput
                  label="Instagram"
                  value={
                    contact.socials
                      ?.instagram
                  }
                  placeholder="https://instagram.com/..."
                  onChange={(value) =>
                    updateContact(
                      "socials",
                      {
                        ...contact.socials,
                        instagram:
                          value,
                      }
                    )
                  }
                />

              </div>

              <FormActions
                saving={saving}
                onSave={() =>
                  saveSectionData(
                    "contact"
                  )
                }
              />
            </AdminCard>
          </section>
        )}

        {/* SETTINGS */}

        {activeTab === "settings" && (
          <section className="admin-section">

            <SectionIntro
              eyebrow="Portfolio Controls"
              title="Settings"
              description="Control which sections are visible on your public portfolio."
            />

            <AdminCard
              title="Section Visibility"
              description="Turn portfolio sections on or off without deleting their content."
            >

              <div className="admin-settings-list">

                {[
                  [
                    "hero",
                    "Hero",
                    "Main introduction and profile section.",
                  ],
                  [
                    "about",
                    "About",
                    "Your personal introduction.",
                  ],
                  [
                    "skills",
                    "Skills",
                    "Technical skills and expertise.",
                  ],
                  [
                    "projects",
                    "Projects",
                    "Selected projects and work.",
                  ],
                  [
                    "experience",
                    "Experience",
                    "Professional career history.",
                  ],
                  [
                    "contact",
                    "Contact",
                    "Contact information and social links.",
                  ],
                ].map(
                  ([key, label, description]) => (
                    <label
                      key={key}
                      className="admin-setting-row"
                    >
                      <div className="admin-setting-icon">
                        {settings[key]
                          ? "✓"
                          : "—"}
                      </div>

                      <div className="admin-setting-info">
                        <strong>
                          {label}
                        </strong>

                        <span>
                          {description}
                        </span>
                      </div>

                      <div className="admin-switch">
                        <input
                          type="checkbox"
                          checked={
                            settings[key]
                          }
                          onChange={(
                            event
                          ) =>
                            updateSetting(
                              key,
                              event.target
                                .checked
                            )
                          }
                        />

                        <span />
                      </div>
                    </label>
                  )
                )}

              </div>

              <FormActions
                saving={saving}
                onSave={() =>
                  saveSectionData(
                    "settings"
                  )
                }
              />
            </AdminCard>
          </section>
        )}
      </main>
    </div>
  );
}

// --------------------------------
// NAV ITEM
// --------------------------------

function AdminNavItem({
  label,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      className={`admin-nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span className="admin-nav-icon">
        {icon}
      </span>

      <span>{label}</span>

      {active && (
        <i className="admin-nav-active-dot" />
      )}
    </button>
  );
}

// --------------------------------
// SECTION INTRO
// --------------------------------

function SectionIntro({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="admin-section-intro">
      <span>{eyebrow}</span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

// --------------------------------
// CARD
// --------------------------------

function AdminCard({
  title,
  description,
  children,
}) {
  return (
    <div className="admin-card">

      <div className="admin-card-header">
        <div>
          <h3>{title}</h3>

          {description && (
            <p>{description}</p>
          )}
        </div>
      </div>

      <div className="admin-card-body">
        {children}
      </div>

    </div>
  );
}

// --------------------------------
// INPUT
// --------------------------------

function AdminInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  helper = "",
  required = false,
  readOnly = false,
}) {
  return (
    <label className="admin-field">
      <div className="admin-field-label">
        <span>{label}</span>

        {required && <b>*</b>}
      </div>

      {helper && <small>{helper}</small>}

      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

// --------------------------------
// TEXTAREA
// --------------------------------

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder = "",
  helper = "",
  rows = 5,
}) {
  return (
    <label className="admin-field admin-field-full">

      <div className="admin-field-label">
        <span>{label}</span>
      </div>

      {helper && (
        <small>{helper}</small>
      )}

      <textarea
        rows={rows}
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

    </label>
  );
}

// --------------------------------
// FORM ACTIONS
// --------------------------------

function FormActions({
  onSave,
  onCancel,
  saving,
  submit = false,
  saveText = "Save Changes",
}) {
  return (
    <div className="admin-form-actions">

      {onCancel && (
        <button
          type="button"
          className="admin-cancel"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      )}

      <button
        type={submit ? "submit" : "button"}
        className="admin-save"
        onClick={!submit ? onSave : undefined}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : saveText}
      </button>

    </div>
  );
}

// --------------------------------
// FILE UPLOAD
// --------------------------------

function FileUpload({
  accept,
  onChange,
  uploading,
}) {
  return (
    <label className="admin-upload">

      <input
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={uploading}
      />

      <div className="admin-upload-icon">
        ↑
      </div>

      <div>
        <strong>
          {uploading
            ? "Uploading..."
            : "Choose a file"}
        </strong>

        <span>
          {uploading
            ? "Please wait..."
            : "Click to browse from your device"}
        </span>
      </div>

    </label>
  );
}

// --------------------------------
// UPLOAD PLACEHOLDER
// --------------------------------

function UploadPlaceholder({
  icon,
  title,
  description,
}) {
  return (
    <div className="admin-upload-placeholder">

      <div>
        {icon}
      </div>

      <strong>{title}</strong>

      <span>{description}</span>
    </div>
  );
}

// --------------------------------
// EMPTY STATE
// --------------------------------

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="admin-empty">

      <div className="admin-empty-icon">
        {icon}
      </div>

      <strong>{title}</strong>

      <span>{text}</span>

    </div>
  );
}

// --------------------------------
// DASHBOARD
// --------------------------------

function Dashboard({
  data,
  setActiveTab,
}) {
  const profile = data.profile || {};

  const counts = {
    skills: Object.keys(
      data.skills || {}
    ).length,

    projects: Object.keys(
      data.projects || {}
    ).length,

    experience: Object.keys(
      data.experience || {}
    ).length,
  };

  return (
    <section className="admin-section">

      <div className="admin-welcome">

        <div>
          <span className="admin-welcome-label">
            WELCOME BACK
          </span>

          <h2>
            {profile.name ||
              "Your Portfolio"}
          </h2>

          <p>
            Manage your portfolio content
            from one place.
          </p>
        </div>

        <div className="admin-status">
          <span />
          System Online
        </div>

      </div>

      <div className="admin-dashboard-grid">

        <DashboardCard
          icon="✦"
          label="Skills"
          value={counts.skills}
          description="Technical skills"
          onClick={() =>
            setActiveTab("skills")
          }
        />

        <DashboardCard
          icon="▣"
          label="Projects"
          value={counts.projects}
          description="Featured work"
          onClick={() =>
            setActiveTab("projects")
          }
        />

        <DashboardCard
          icon="◷"
          label="Experience"
          value={counts.experience}
          description="Career positions"
          onClick={() =>
            setActiveTab("experience")
          }
        />

        <DashboardCard
          icon="◎"
          label="Experience"
          value={
            profile.yearsExperience ||
            0
          }
          description="Years in industry"
          onClick={() =>
            setActiveTab("profile")
          }
        />

      </div>

      <div className="admin-dashboard-row">

        <div className="admin-card dashboard-profile-card">

          <div className="admin-card-header">
            <div>
              <h3>Profile Overview</h3>
              <p>
                Quickly update your public
                profile information.
              </p>
            </div>

            <button
              onClick={() =>
                setActiveTab("profile")
              }
            >
              Edit Profile ↗
            </button>
          </div>

          <div className="dashboard-profile-content">

            <div className="dashboard-avatar">
              {profile.imageUrl ? (
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                />
              ) : (
                <span>
                  {profile.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "R"}
                </span>
              )}
            </div>

            <div>
              <h3>
                {profile.name ||
                  "Your Name"}
              </h3>

              <p>
                {profile.position ||
                  "Your Position"}
              </p>

              <span>
                {profile.status ||
                  "Available for Work"}
              </span>
            </div>

          </div>

        </div>

        <div className="admin-card dashboard-quick-card">

          <div className="admin-card-header">
            <div>
              <h3>Quick Actions</h3>
              <p>
                Jump directly to common tasks.
              </p>
            </div>
          </div>

          <div className="dashboard-quick-actions">

            <button
              onClick={() =>
                setActiveTab("projects")
              }
            >
              <span>＋</span>
              Add Project
            </button>

            <button
              onClick={() =>
                setActiveTab("skills")
              }
            >
              <span>＋</span>
              Add Skill
            </button>

            <button
              onClick={() =>
                setActiveTab(
                  "experience"
                )
              }
            >
              <span>＋</span>
              Add Experience
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

function DashboardCard({
  icon,
  label,
  value,
  description,
  onClick,
}) {
  return (
    <button
      className="dashboard-card"
      onClick={onClick}
    >
      <div className="dashboard-card-top">

        <span className="dashboard-card-icon">
          {icon}
        </span>

        <span>↗</span>

      </div>

      <strong>{value}</strong>

      <span className="dashboard-card-label">
        {label}
      </span>

      <small>
        {description}
      </small>
    </button>
  );
}

// --------------------------------
// HELPERS
// --------------------------------

function capitalize(value = "") {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getPageDescription(tab) {
  const descriptions = {
    dashboard:
      "A quick overview of your portfolio.",
    profile:
      "Manage your personal information.",
    about:
      "Tell visitors more about yourself.",
    skills:
      "Manage your technical expertise.",
    projects:
      "Manage your featured projects.",
    experience:
      "Manage your professional experience.",
    contact:
      "Manage your contact information.",
    settings:
      "Control your portfolio visibility.",
  };

  return descriptions[tab] || "";
}