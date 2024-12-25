"use client";
import { useState, useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";
import Image from "next/image";
import icon from "../../public/icon.png";

const galacticMap: Record<string, string> = {
    A: "ᔑ", B: "ʖ", C: "ᓵ", D: "↸", E: "ᒷ", F: "⎓", G: "⊣", H: "⍑", I: "╎", J: "⋮",
    K: "ꖌ", L: "ꖎ", M: "ᒲ", N: "リ", O: "𝙹", P: "!¡", Q: "ᑑ", R: "∷", S: "ᓭ", T: "ℸ",
    U: "⚍", V: "⍊", W: "∴", X: "∵", Y: "⨅", Z: "⨀",
    a: "ᔑ", b: "ʖ", c: "ᓵ", d: "↸", e: "ᒷ", f: "⎓", g: "⊣", h: "⍑", i: "╎", j: "⋮",
    k: "ꖌ", l: "ꖎ", m: "ᒲ", n: "リ", o: "𝙹", p: "!¡", q: "ᑑ", r: "∷", s: "ᓭ", t: "ℸ",
    u: "⚍", v: "⍊", w: "∴", x: "∵", y: "⨅", z: "⨀"
};

const encrypt = (text: string) =>
    text.split("").map((c) => galacticMap[c] || c).join("");

const decrypt = (text: string) => {
    const rev = Object.entries(galacticMap).reduce<Record<string, string>>(
        (acc, [latin, galactic]) => {
            acc[galactic] = latin;
            return acc;
        },
        {}
    );
    let res = "";
    let i = 0;
    while (i < text.length) {
        if (i + 1 < text.length && rev[text[i] + text[i + 1]]) {
            res += rev[text[i] + text[i + 1]];
            i += 2;
        } else {
            res += rev[text[i]] || text[i];
            i++;
        }
    }
    return res;
};

function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const numStars = 200;
        const stars = Array.from({ length: numStars }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.5 + 0.05
        }));

        let animationId: number;
        const animate = () => {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 4,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width
            );
            gradient.addColorStop(0, "#000000");
            gradient.addColorStop(1, "#050510");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (const star of stars) {
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                // Efek interaksi mouse
                const dx = star.x - mousePos.current.x;
                const dy = star.y - mousePos.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const angle = Math.atan2(dy, dx);
                    star.x += Math.cos(angle) * 1.5;
                    star.y += Math.sin(angle) * 1.5;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
            }

            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 -z-10"
            style={{ display: "block" }}
        />
    );
}

export default function Home() {
    const [plain, setPlain] = useState("");
    const [cipher, setCipher] = useState("");

    return (
        <div className="min-h-screen flex flex-col text-gray-200 relative overflow-hidden">
            <SpaceBackground />

            <main className="flex-grow flex flex-col items-center justify-center p-4 animate-[fadeIn_1.2s_ease-in-out]">
                <Image src={icon} alt="Icon" width={128} height={128} className="mb-4" />
                <h1 className="text-5xl font-extrabold mb-8 animate-bounce">
                    Encryalactic
                </h1>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex flex-col items-center w-full md:w-auto">
                        <h2 className="text-xl font-semibold mb-2">Plaintext</h2>
                        <textarea
                            className="
                w-full md:w-80 h-40
                p-4 rounded-xl shadow-xl
                bg-white/10 backdrop-blur-sm border border-white/20
                focus:ring-4 focus:ring-blue-500
                resize-none
                transition-all duration-300 hover:shadow-2xl
              "
                            placeholder="Input text..."
                            value={plain}
                            onChange={(e) => {
                                setPlain(e.target.value);
                                setCipher(encrypt(e.target.value));
                            }}
                        />
                    </div>

                    <div className="flex flex-col items-center w-full md:w-auto">
                        <h2 className="text-xl font-semibold mb-2">Ciphertext</h2>
                        <textarea
                            className="
                w-full md:w-80 h-40
                p-4 rounded-xl shadow-xl
                bg-white/10 backdrop-blur-sm border border-white/20
                focus:ring-4 focus:ring-blue-500
                resize-none
                transition-all duration-300 hover:shadow-2xl
              "
                            placeholder="Encrypted text..."
                            value={cipher}
                            onChange={(e) => {
                                setCipher(e.target.value);
                                setPlain(decrypt(e.target.value));
                            }}
                        />
                    </div>
                </div>
            </main>

            <footer className="w-full text-center p-4 bg-gray-800 text-gray-400">
                Created with ❤️, Hendianto Mohammad Farid CB24153 UMPSA
            </footer>
        </div>
    );
}