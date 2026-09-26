import { useEffect, useState } from "react";

import { getPortfolioData } from "../firebase/database";

import MeteorBackground from "../components/MeteorBackground";
import CursorTrail from "../components/CursorTrail";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";

export default function Portfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const result = await getPortfolioData();
        setData(result || {});
      } catch (error) {
        console.error(
          "Failed to load portfolio:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "white",
          display: "grid",
          placeItems: "center",
          fontSize: 12,
        }}
      >
        LOADING...
      </div>
    );
  }

  const settings = data?.settings || {};

  return (
    <>
      <MeteorBackground />
      <CursorTrail />

      <Navbar profile={data?.profile} />

      <main>
        {settings.hero !== false && (
          <Hero
            profile={data?.profile}
            about={data?.about}
          />
        )}

        {settings.about !== false && (
          <About about={data?.about} />
        )}

        {settings.skills !== false && (
          <Skills skills={data?.skills} />
        )}

        {settings.projects !== false && (
          <Projects projects={data?.projects} />
        )}

        {settings.experience !== false && (
          <Experience
            experience={data?.experience}
          />
        )}

        {settings.contact !== false && (
          <Contact contact={data?.contact} />
        )}
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "30px 0",
          color: "var(--muted)",
          fontSize: 9,
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()}{" "}
        {data?.profile?.name || "Portfolio"} — Built
        with code.
      </footer>
    </>
  );
}