import type { Metadata } from "next";
import { LoveMenuApp } from "./LoveMenuApp";

export const metadata: Metadata = {
  title: "LoveMenu · 家庭菜单",
  description: "记录家里爱吃的菜，安排每日菜单和采购清单。",
};

export default function Home() {
  return <LoveMenuApp />;
}
