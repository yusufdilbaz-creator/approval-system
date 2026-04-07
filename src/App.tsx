import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

type SessionUser = {
  email?: string;
};

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "search", label: "Search" },
  { key: "new", label: "New Entry" },
  { key: "status", label: "Status" },
  { key: "approvals", label: "My Pending Approvals" },
  { key: "projects", label: "Projects" },
  { key: "users", label: "Users" },
  { key: "budgets", label: "Budgets" },
  { key: "matrix", label: "Approval Matrix" },
  { key: "settings", label: "Settings" },
];

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp() {
    setAuthMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    setAuthMessage("Signup successful. You can now sign in.");
  }

  async function signIn() {
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    setAuthMessage("Login successful.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setActivePage("dashboard");
  }

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authHero}>
          <div style={styles.badge}>Internal approval demo</div>
          <h1 style={styles.heroTitle}>Subcontractor & purchase order approval system</h1>
          <p style={styles.heroText}>
            Budget control, approval routing, user permissions and request tracking in one live system.
          </p>

          <div style={styles.heroGrid}>
            <div style={styles.heroCard}>
              <div style={styles.heroCardLabel}>Live system</div>
              <div style={styles.heroCardValue}>Supabase connected</div>
              <div style={styles.heroCardSmall}>Login is now real, not demo-only.</div>
            </div>

            <div style={styles.heroCard}>
              <div style={styles.heroCardLabel}>Next phase</div>
              <div style={styles.heroCardValue}>Professional UI shell</div>
              <div style={styles.heroCardSmall}>Ready for PAR screens, budgets and approvals.</div>
            </div>
          </div>
        </div>

        <div style={styles.authPanel}>
          <div style={styles.authTabs}>
            <div style={styles.authTabActive}>Login / Signup</div>
          </div>

          <h2 style={styles.authTitle}>Welcome back</h2>
          <p style={styles.authSubtitle}>Sign in to continue, or create a new account.</p>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {authMessage ? (
            <div style={styles.messageBox}>{authMessage}</div>
          ) : null}

          <button style={styles.primaryButton} onClick={signIn}>
            Sign In
          </button>

          <button style={styles.secondaryButton} onClick={signUp}>
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.sidebarEyebrow}>Approval system</div>
          <div style={styles.sidebarTitle}>PO / SO Internal Review Hub</div>
        </div>

        <div style={styles.userCard}>
          <div style={styles.userName}>{user.email || "User"}</div>
          <div style={styles.userRole}>Logged in user</div>
        </div>

        <div style={styles.navList}>
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              style={{
                ...styles.navButton,
                ...(activePage === item.key ? styles.navButtonActive : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button style={styles.logoutButton} onClick={signOut}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <div style={styles.topbarTitle}>
              {sidebarItems.find((x) => x.key === activePage)?.label || "Dashboard"}
            </div>
            <div style={styles.topbarSubtitle}>
              Live shell ready for real PAR screens and approval workflow.
            </div>
          </div>

          <div style={styles.topbarRight}>
            <div style={styles.topbarUser}>{user.email}</div>
          </div>
        </div>

        <div style={styles.content}>
          {activePage === "dashboard" && (
            <>
              <div style={styles.cardGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Total Requests</div>
                  <div style={styles.statValue}>0</div>
                  <div style={styles.statSmall}>Will connect to real PAR data next</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Waiting for Approval</div>
                  <div style={styles.statValue}>0</div>
                  <div style={styles.statSmall}>Approval queue placeholder</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Projects</div>
                  <div style={styles.statValue}>0</div>
                  <div style={styles.statSmall}>Project register comes next</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Budget Lines</div>
                  <div style={styles.statValue}>0</div>
                  <div style={styles.statSmall}>Budget import screen comes next</div>
                </div>
              </div>

              <div style={styles.panel}>
                <h3 style={styles.panelTitle}>Dashboard overview</h3>
                <p style={styles.panelText}>
                  This is now the professional shell version of your system. The next step is to bring in the real PAR entry screen,
                  request list, status screen, admin users, budgets and approval matrix one by one.
                </p>
              </div>
            </>
          )}

          {activePage !== "dashboard" && (
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>
                {sidebarItems.find((x) => x.key === activePage)?.label}
              </h3>
              <p style={styles.panelText}>
                This screen shell is ready. Next we will replace this placeholder with the real live module.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2f7",
    padding: 24,
  },
  loadingCard: {
    background: "#ffffff",
    borderRadius: 24,
    padding: "24px 32px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
    fontSize: 18,
    color: "#0f172a",
  },
  authPage: {
    minHeight: "100vh",
    background: "#eef2f7",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 24,
    padding: 24,
  },
  authHero: {
    borderRadius: 32,
    padding: 40,
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
    color: "#ffffff",
    boxShadow: "0 20px 50px rgba(15,23,42,0.20)",
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    fontSize: 13,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 1.15,
    margin: "0 0 16px 0",
  },
  heroText: {
    fontSize: 16,
    color: "#dbeafe",
    maxWidth: 700,
    marginBottom: 28,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  heroCard: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: 24,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  heroCardLabel: {
    fontSize: 13,
    color: "#cbd5e1",
    marginBottom: 8,
  },
  heroCardValue: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
  },
  heroCardSmall: {
    fontSize: 14,
    color: "#e2e8f0",
  },
  authPanel: {
    borderRadius: 32,
    background: "#ffffff",
    padding: 36,
    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
    alignSelf: "center",
  },
  authTabs: {
    background: "#f1f5f9",
    borderRadius: 18,
    padding: 6,
    marginBottom: 24,
  },
  authTabActive: {
    borderRadius: 14,
    background: "#ffffff",
    padding: "12px 16px",
    fontWeight: 600,
    color: "#0f172a",
    boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
    textAlign: "center",
  },
  authTitle: {
    margin: "0 0 8px 0",
    fontSize: 28,
    color: "#0f172a",
  },
  authSubtitle: {
    margin: "0 0 24px 0",
    color: "#64748b",
  },
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },
  messageBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    borderRadius: 16,
    padding: "12px 14px",
    marginBottom: 16,
    fontSize: 14,
  },
  primaryButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 12,
  },
  secondaryButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  appShell: {
    minHeight: "100vh",
    background: "#eef2f7",
    display: "grid",
    gridTemplateColumns: "290px 1fr",
    gap: 0,
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },
  sidebarTop: {
    marginBottom: 20,
  },
  sidebarEyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "#94a3b8",
    marginBottom: 8,
  },
  sidebarTitle: {
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 700,
    color: "#0f172a",
  },
  userCard: {
    borderRadius: 22,
    background: "#f8fafc",
    padding: 16,
    marginBottom: 18,
    border: "1px solid #e2e8f0",
  },
  userName: {
    fontWeight: 700,
    color: "#0f172a",
    wordBreak: "break-word",
    marginBottom: 6,
  },
  userRole: {
    color: "#64748b",
    fontSize: 14,
  },
  navList: {
    display: "grid",
    gap: 8,
    flex: 1,
  },
  navButton: {
    textAlign: "left",
    padding: "14px 16px",
    borderRadius: 18,
    border: "none",
    background: "transparent",
    color: "#334155",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
  },
  navButtonActive: {
    background: "#0f172a",
    color: "#ffffff",
  },
  logoutButton: {
    marginTop: 12,
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 600,
  },
  main: {
    padding: 24,
  },
  topbar: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 22,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    marginBottom: 24,
  },
  topbarTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
  },
  topbarSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  topbarUser: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 999,
    padding: "10px 14px",
    color: "#334155",
    fontSize: 14,
  },
  content: {
    display: "grid",
    gap: 24,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 34,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 10,
  },
  statSmall: {
    fontSize: 14,
    color: "#94a3b8",
  },
  panel: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },
  panelTitle: {
    margin: "0 0 12px 0",
    fontSize: 24,
    color: "#0f172a",
  },
  panelText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 15,
  },
};
