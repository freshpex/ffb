import { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "../../context/DarkModeContext";

const FIRST_NAMES = ["Amina", "Amara", "Ana", "Arjun", "Aya", "Chinedu", "Daniel", "David", "Elena", "Fatima", "Grace", "Hana", "Ibrahim", "Isabella", "James", "Javier", "Jean", "Jordan", "Kwame", "Layla", "Leila", "Liam", "Lucas", "Mariam", "Mateo", "Maya", "Michael", "Mohamed", "Nadia", "Noah", "Olivia", "Priya", "Rania", "Samuel", "Sara", "Sofia", "Thomas", "Victor", "Wei", "Yasmin", "Zara"];
const LAST_NAMES = ["Abbas", "Adeyemi", "Ali", "Anderson", "Bennett", "Brown", "Chen", "Costa", "Diallo", "Dubois", "Garcia", "Haddad", "Hassan", "Ivanov", "Johnson", "Kamara", "Khan", "Kim", "Kumar", "Lee", "Lopez", "Martin", "Mensah", "Miller", "Moyo", "Müller", "Nguyen", "Njoroge", "Okafor", "Patel", "Rossi", "Santos", "Silva", "Singh", "Smith", "Taylor", "Williams", "Wilson", "Yilmaz", "Zhang"];
const BANKS = ["Chase", "HSBC", "Citibank", "Wells Fargo", "Barclays", "Santander", "Standard Chartered", "BNP Paribas", "Deutsche Bank", "ING", "Revolut", "Wise", "N26", "Ecobank", "Access Bank", "GTBank", "FirstBank", "UBA", "Zenith Bank", "Absa", "Nedbank", "KCB Bank", "Equity Bank"];
const PAYMENT_TYPES = ["BTC", "USDT", "ETH", "Bank"];
const ALPHANUM = "0123456789abcdefghijklmnopqrstuvwxyz";
const HEX = "0123456789abcdef";

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (values) => values[randInt(0, values.length - 1)];
const randomString = (alphabet, length) => Array.from({ length }, () => pick(alphabet)).join("");

function maskedName() {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return `${first[0]}${"•".repeat(Math.max(2, first.length - 1))} ${last[0]}${"•".repeat(Math.max(2, last.length - 1))}`;
}

function amount(type) {
  if (type === "BTC") return `${(Math.random() * 0.48 + 0.002).toFixed(4)} BTC`;
  if (type === "ETH") return `${(Math.random() * 7.5 + 0.04).toFixed(3)} ETH`;
  if (type === "USDT") return `${(Math.random() * 4800 + 25).toFixed(2)} USDT`;
  return `$${(Math.random() * 14500 + 75).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

function destination(type) {
  if (type === "Bank") return `${pick(BANKS)} •••• ${String(randInt(0, 9999)).padStart(4, "0")}`;
  if (type === "BTC") return `bc1q${randomString(ALPHANUM, 6)}…${randomString(ALPHANUM, 5)}`;
  return `0x${randomString(HEX, 7)}…${randomString(HEX, 5)}`;
}

function makeItem(index) {
  const type = pick(PAYMENT_TYPES);
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    name: maskedName(),
    type,
    amount: amount(type),
    destination: destination(type),
    timeAgo: `${randInt(1, 58)}s ago`,
  };
}

const badgeColor = (type) => ({ BTC: "#f7931a", ETH: "#627eea", USDT: "#26a17b", Bank: "#3b82f6" })[type] || "#64748b";

export default function WithdrawDummy({ compact = false, className = "" }) {
  const { darkMode } = useDarkMode();
  const itemCount = compact ? 8 : 14;
  const [seed, setSeed] = useState(0);
  const items = useMemo(() => Array.from({ length: itemCount }, (_, index) => makeItem(index)), [seed, itemCount]);
  const display = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const timer = window.setInterval(() => setSeed((value) => value + 1), 18000);
    return () => window.clearInterval(timer);
  }, []);

  const surface = darkMode ? "rgba(10, 15, 28, 0.97)" : "rgba(255, 255, 255, 0.97)";
  const itemSurface = darkMode ? "rgba(30, 41, 59, .9)" : "rgba(248, 250, 252, .96)";
  const primaryText = darkMode ? "#f8fafc" : "#0f172a";
  const secondaryText = darkMode ? "#94a3b8" : "#64748b";

  return (
    <aside
      className={className}
      aria-label="Illustrative recent withdrawal activity"
      style={{
        position: compact ? "relative" : "sticky",
        top: compact ? "auto" : 72,
        zIndex: compact ? 1 : 40,
        width: "100%",
        overflow: "hidden",
        background: surface,
        borderBottom: compact ? "none" : `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
        boxShadow: compact ? "none" : "0 8px 24px rgba(15, 23, 42, .12)",
        fontFamily: "Inter, system-ui, Arial, sans-serif",
        marginTop: compact ? 0 : 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: compact ? "6px 0" : "7px 0" }}>
        {!compact && (
          <div style={{ flex: "0 0 auto", padding: "0 14px", borderRight: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}` }}>
            <div style={{ color: primaryText, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}><span style={{ color: "#22c55e" }}>●</span> Withdrawal activity</div>
            <div style={{ color: secondaryText, fontSize: 9, marginTop: 2 }}>Illustrative, privacy-masked examples</div>
          </div>
        )}
        <div style={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
          <div key={seed} className="withdrawal-ticker-track" style={{ display: "inline-flex", whiteSpace: "nowrap", willChange: "transform", animationDuration: `${Math.max(40, items.length * 4)}s` }}>
            {display.map((item, index) => (
              <div key={`${item.id}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: compact ? 8 : 10, padding: compact ? "6px 10px" : "7px 13px", marginRight: 7, background: itemSurface, borderRadius: 9, border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, minWidth: compact ? 215 : 290 }}>
                <span style={{ minWidth: 39, height: 30, borderRadius: 7, background: badgeColor(item.type), display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 10 }}>{item.type}</span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                  <span style={{ color: primaryText, fontWeight: 700, fontSize: compact ? 11 : 12 }}>{item.name} · {item.amount}</span>
                  <span style={{ color: secondaryText, fontSize: 10 }}>{item.destination}</span>
                </span>
                <span style={{ color: secondaryText, fontSize: 10, marginLeft: "auto" }}>{item.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes withdrawal-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .withdrawal-ticker-track { animation: withdrawal-scroll linear infinite; }
        .withdrawal-ticker-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .withdrawal-ticker-track { animation: none; } }
      `}</style>
    </aside>
  );
}
