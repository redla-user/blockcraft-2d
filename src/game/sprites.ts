// Procedural pixel-art sprites drawn on canvas (no image assets needed).
import type { ObjKind, TileType } from "./data";
import { TILE_COLORS } from "./data";

export type Ctx = CanvasRenderingContext2D;

function px(c: Ctx, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
}

function hash(x: number, y: number, s: number) {
  let h = x * 374761393 + y * 668265263 + s * 977;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function drawGround(c: Ctx, t: TileType, ore: string | undefined, x: number, y: number, S: number, wx: number, wy: number) {
  const pair = TILE_COLORS[t];
  px(c, x, y, S, S, pair[0]);
  const q = S / 4;
  for (let i = 0; i < 4; i++) {
    const hx = Math.floor(hash(wx, wy, i * 3 + 1) * 4);
    const hy = Math.floor(hash(wx, wy, i * 3 + 2) * 4);
    px(c, x + hx * q, y + hy * q, q, q, pair[1]);
  }
  if (t === "farmland") {
    px(c, x, y + q, S, q / 2, "#7d5730");
    px(c, x, y + 3 * q, S, q / 2, "#7d5730");
  }
  if (ore) {
    const col = ore === "iron" ? "#d9b48a" : "#4fe0d6";
    px(c, x + q, y + q, q, q, col);
    px(c, x + 2 * q, y + 2 * q, q, q, col);
    px(c, x + 2.5 * q, y + 0.5 * q, q * 0.6, q * 0.6, col);
  }
}

/** Tall objects are drawn from their base (bottom of tile). */
export function drawObject(c: Ctx, kind: ObjKind, x: number, baseY: number, S: number) {
  const u = S / 8;
  switch (kind) {
    case "tree": {
      px(c, x + 3 * u, baseY - S * 0.9, 2 * u, S * 0.9, "#6b4a22");
      px(c, x - u, baseY - S * 2, 10 * u, S * 1.2, "#2f7a2a");
      px(c, x + u, baseY - S * 2.4, 6 * u, S * 0.6, "#3c9433");
      px(c, x + 2 * u, baseY - S * 1.5, 2 * u, u, "#265f22");
      break;
    }
    case "mountain": {
      px(c, x - u, baseY - S * 1.6, 10 * u, S * 1.6, "#7a7a7a");
      px(c, x + u, baseY - S * 2.3, 6 * u, S * 0.8, "#8f8f8f");
      px(c, x + 2.5 * u, baseY - S * 2.6, 3 * u, S * 0.5, "#e9eef2");
      break;
    }
    case "bed": {
      px(c, x + u, baseY - S * 0.85, 6 * u, S * 0.8, "#b7362f");
      px(c, x + u, baseY - S * 0.85, 6 * u, S * 0.28, "#f2f2f2");
      px(c, x + u, baseY - S * 0.1, 6 * u, u * 0.6, "#6b4a22");
      break;
    }
    case "crop0":
    case "crop1":
    case "crop2":
    case "crop3": {
      const stage = parseInt(kind.slice(4), 10);
      const h = S * (0.25 + stage * 0.22);
      const col = stage >= 3 ? "#e0c04a" : "#8db83f";
      px(c, x + 2 * u, baseY - h, u, h, col);
      px(c, x + 5 * u, baseY - h * 0.8, u, h * 0.8, col);
      if (stage >= 2) px(c, x + 3.5 * u, baseY - h * 1.1, u, h * 0.5, col);
      break;
    }
    default: {
      const map: Record<string, [string, string]> = {
        block_dirt: ["#8b6039", "#6f4c2c"],
        block_stone: ["#9a9a9a", "#787878"],
        block_sand: ["#e6d9a2", "#c8bb84"],
        block_wood: ["#8a5f27", "#6d4a1d"],
        block_wool: ["#f4f4f4", "#d6d6d6"],
      };
      const cols = map[kind] ?? ["#999", "#777"];
      px(c, x, baseY - S * 1.1, S, S * 1.1, cols[0]);
      px(c, x, baseY - S * 0.25, S, S * 0.25, cols[1]);
      px(c, x + u, baseY - S * 0.95, 2 * u, 2 * u, cols[1]);
      break;
    }
  }
}

export function drawPlayer(c: Ctx, x: number, baseY: number, S: number, dir: string, hurt: boolean) {
  const u = S / 8;
  const skin = hurt ? "#ff8f7a" : "#c98d63";
  px(c, x + 2 * u, baseY - S * 1.3, 4 * u, 3.2 * u, "#3b2b17"); // hair/head
  if (dir !== "up") {
    px(c, x + 2.5 * u, baseY - S * 1.05, 3 * u, 1.6 * u, skin);
    px(c, x + 3 * u, baseY - S * 1.0, 0.7 * u, 0.7 * u, "#1b1b1b");
    px(c, x + 4.4 * u, baseY - S * 1.0, 0.7 * u, 0.7 * u, "#1b1b1b");
  }
  px(c, x + 2 * u, baseY - S * 0.75, 4 * u, 3 * u, "#3fc7c9"); // body
  px(c, x + 0.8 * u, baseY - S * 0.72, 1.4 * u, 2.4 * u, skin); // arms
  px(c, x + 5.8 * u, baseY - S * 0.72, 1.4 * u, 2.4 * u, skin);
  px(c, x + 2 * u, baseY - S * 0.36, 1.8 * u, 2.8 * u, "#2b3fbe"); // legs
  px(c, x + 4.2 * u, baseY - S * 0.36, 1.8 * u, 2.8 * u, "#2b3fbe");
}

const MOB_COLORS: Record<string, { a: string; b: string }> = {
  pig: { a: "#eda3a8", b: "#d4868c" },
  cow: { a: "#f0efe9", b: "#3d2a1c" },
  sheep: { a: "#f7f7f2", b: "#d9d4c8" },
  zombie: { a: "#4b8a52", b: "#2f5f36" },
  skeleton: { a: "#e6e6e0", b: "#b9b9b0" },
  spider: { a: "#2f2f33", b: "#8b1c1c" },
  creeper: { a: "#4fbf4f", b: "#2f8f2f" },
};

export function drawMob(c: Ctx, kind: string, x: number, baseY: number, S: number, flash: boolean) {
  const u = S / 8;
  const col = MOB_COLORS[kind] ?? { a: "#aaa", b: "#777" };
  const body = flash ? "#ffffff" : col.a;
  if (kind === "spider") {
    px(c, x + u, baseY - S * 0.7, 6 * u, 4 * u, body);
    px(c, x, baseY - S * 0.55, u, 0.8 * u, col.a);
    px(c, x + 7 * u, baseY - S * 0.55, u, 0.8 * u, col.a);
    px(c, x + 2 * u, baseY - S * 0.6, u, u, col.b);
    px(c, x + 5 * u, baseY - S * 0.6, u, u, col.b);
    return;
  }
  if (kind === "creeper") {
    px(c, x + 2 * u, baseY - S * 1.5, 4 * u, 4 * u, body);
    px(c, x + 2.6 * u, baseY - S * 1.3, u, u, "#1b1b1b");
    px(c, x + 4.4 * u, baseY - S * 1.3, u, u, "#1b1b1b");
    px(c, x + 3.4 * u, baseY - S * 1.05, 1.2 * u, 1.4 * u, "#1b1b1b");
    px(c, x + 2.4 * u, baseY - S * 0.95, 3.2 * u, 7.6 * u, flash ? "#ffffff" : col.b);
    return;
  }
  const tall = kind === "zombie" || kind === "skeleton";
  if (tall) {
    px(c, x + 2.4 * u, baseY - S * 1.35, 3.2 * u, 3 * u, body);
    px(c, x + 3 * u, baseY - S * 1.15, 0.7 * u, 0.7 * u, kind === "zombie" ? "#123" : "#333");
    px(c, x + 4.3 * u, baseY - S * 1.15, 0.7 * u, 0.7 * u, kind === "zombie" ? "#123" : "#333");
    px(c, x + 2.4 * u, baseY - S * 0.9, 3.2 * u, 3.4 * u, col.b);
    px(c, x + 1 * u, baseY - S * 0.95, 1.2 * u, 3 * u, body);
    px(c, x + 5.8 * u, baseY - S * 0.95, 1.2 * u, 3 * u, body);
    px(c, x + 2.6 * u, baseY - S * 0.42, 1.2 * u, 3.2 * u, col.b);
    px(c, x + 4.4 * u, baseY - S * 0.42, 1.2 * u, 3.2 * u, col.b);
    return;
  }
  // passive quadruped
  px(c, x + u, baseY - S * 0.85, 6 * u, 3.4 * u, body);
  px(c, x + 5.4 * u, baseY - S * 1.1, 2.4 * u, 2.4 * u, kind === "cow" ? col.b : body);
  px(c, x + 1.4 * u, baseY - S * 0.3, u, 2.4 * u, col.b);
  px(c, x + 5.4 * u, baseY - S * 0.3, u, 2.4 * u, col.b);
  if (kind === "cow") px(c, x + 2 * u, baseY - S * 0.8, 1.6 * u, 1.4 * u, col.b);
}

export function drawItemIcon(c: Ctx, id: string, x: number, y: number, S: number) {
  px(c, x, y, S, S, "#00000000");
}
