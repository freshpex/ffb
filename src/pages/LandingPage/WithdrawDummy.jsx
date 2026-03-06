import { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "../../context/DarkModeContext";

const PAYMENT_TYPES = ["BTC", "USDT", "ETH", "Bank"];
const FIRST_NAMES = [
    "Oliver","Charlotte","Liam","Amelia","Noah","Olivia","Elijah","Ava",
    "William","Sophia","James","Isabella","Benjamin","Mia","Lucas","Harper"
];
const LAST_NAMES = [
    "Smith","Johnson","Brown","Taylor","Anderson","Thomas","Jackson","White",
    "Harris","Martin","Thompson","Garcia","Martinez","Robinson"
];

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
}

function randomName() {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    return `${first} ${last.charAt(0)}.`; // masked-ish: first name + last initial
}

function randomAmount(type) {
    // amounts in approximate realistic ranges
    switch (type) {
        case "BTC": return `${(Math.random() * 0.5 + 0.01).toFixed(4)} BTC`;
        case "ETH": return `${(Math.random() * 5 + 0.05).toFixed(3)} ETH`;
        case "USDT": return `${(Math.random() * 2000 + 10).toFixed(2)} USDT`;
        case "Bank": return `$${(Math.random() * 10000 + 50).toFixed(2)}`;
        default: return "$0";
    }
}

function randomAddress(type) {
    if (type === "Bank") {
        // show masked account: ****1234 (4 last digits)
        const last4 = String(randInt(0, 9999)).padStart(4, "0");
        const bank = ["Chase", "HSBC", "Citi", "WellsFargo", "Standard Chartered"][randInt(0,4)];
        return `${bank} • ****${last4}`;
    }
    // crypto: show first 6 and last 4 for realism
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const gen = (len) => Array.from({length: len}, () => chars[randInt(0, chars.length-1)]).join("");
    const first = gen(6);
    const last = gen(4);
    if (type === "BTC") {
        return `bc1${first}...${last}`; // bc1 addresses start like this commonly
    }
    if (type === "ETH" || type === "USDT") {
        return `0x${first}...${last}`;
    }
    return `${first}...${last}`;
}

function makeItem() {
    const type = pick(PAYMENT_TYPES);
    return {
        id: Math.random().toString(36).slice(2, 9),
        name: randomName(),
        type,
        amount: randomAmount(type),
        dest: randomAddress(type),
        timeAgo: `${randInt(1, 59)}s ago`
    };
}

export default function WithdrawDummy({ compact = false, className = "" }) {
    const { darkMode } = useDarkMode();
    const BASE_COUNT = compact ? 8 : 12;
    const [seed, setSeed] = useState(0);

    // Build a base list of entries; regenerate when seed changes
    const items = useMemo(() => {
        return Array.from({ length: BASE_COUNT }, () => makeItem());
    }, [seed, BASE_COUNT]);

    // refresh periodically to keep content feeling live
    useEffect(() => {
        const t = setInterval(() => {
            setSeed((s) => s + 1);
        }, 12000); // regenerate every 12s
        return () => clearInterval(t);
    }, []);

    // Duplicate items to allow seamless CSS marquee loop
    const display = [...items, ...items];

    // theme-aware colors
    const outerBg = darkMode ? "#FFFFFF" : "rgba(0,0,0,0.04)";
    const itemBg = darkMode ? "#000000" : "rgba(255,255,255,0.65)";
    const itemBorder = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
    const textColor = darkMode ? "#e5e7eb" : "#111827";
    const secondaryText = darkMode ? "#9ca3af" : "#6b7280";

    return (
        <div className={`${className}`} style={{ overflow: "hidden", width: "100%", marginTop: compact ? 12 : 64 }}>
            <div style={{
                background: outerBg,
                borderRadius: 8,
                padding: compact ? "6px 0" : "8px 0",
                boxSizing: "border-box",
                fontFamily: "Inter, system-ui, Arial, sans-serif",
                fontSize: compact ? 12 : 13,
                color: textColor,
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.02)' : 'transparent'}`
            }}>
                <div
                    className="ticker"
                    key={seed} // restart animation on seed change for fresh items
                    style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        willChange: "transform",
                        animation: "scroll-left linear infinite",
                        animationDuration: `${6 + items.length * 5}s`,
                    }}
                >
                    {display.map((it, idx) => (
                        <div
                            key={it.id + "-" + idx}
                            className="ticker-item"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: compact ? 8 : 12,
                                padding: compact ? "6px 12px" : "8px 18px",
                                marginRight: compact ? 6 : 8,
                                background: itemBg,
                                borderRadius: 10,
                                boxShadow: darkMode ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
                                border: `1px solid ${itemBorder}`,
                                minWidth: compact ? 160 : 220,
                            }}
                        >
                            <div style={{
                                minWidth: compact ? 36 : 44,
                                height: compact ? 36 : 44,
                                borderRadius: 10,
                                background: badgeColor(it.type),
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: compact ? 11 : 12
                            }}>{it.type}</div>
                            <div style={{display: "flex", flexDirection: "column", lineHeight: 1}}>
                                <div style={{fontWeight: 600, color: textColor}}>{it.name} • {it.amount}</div>
                                <div style={{color: secondaryText, fontSize: compact ? 11 : 12}}>{maskDest(it.dest)}</div>
                            </div>
                            <div style={{marginLeft: 10, color: secondaryText, fontSize: compact ? 11 : 12}}>{it.timeAgo}</div>
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes scroll-left {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    /* small responsive tweak */
                    @media (max-width: 480px) {
                        .ticker-item { padding: 8px 12px; margin-right: 6px; min-width: 140px; }
                    }
                `}</style>
            </div>
        </div>
    );
}

// helpers used inside component but below to keep top area clean
function badgeColor(type) {
    switch (type) {
        case "BTC": return "#f7931a";
        case "ETH": return "#627eea";
        case "USDT": return "#26a17b";
        case "Bank": return "#3b82f6";
        default: return "#888";
    }
}

function maskDest(dest) {
    // ensure dest is not too revealing; if it already has ellipsis keep it
    if (dest.includes("...")) return dest;
    // for bank style like "Chase • ****1234", ensure only last 4 visible
    if (dest.includes("•")) return dest;
    // otherwise mask middle
    if (dest.length > 10) {
        return dest.slice(0, 6) + "..." + dest.slice(-4);
    }
    return dest;
}