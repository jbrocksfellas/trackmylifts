import { getAccessToken } from "@/";
import React from "react";

async function getExercises() {
  const res = await fetch(`${process.env.API_URL}/exercises`, { headers: { Authorization: "Bearer " + getAccessToken() }, cache: "no-store" });
  const data = res.json();
  return data.exercises;
}

export default async function Page() {
  const exercises = await getExercises();

  return <div></div>;
}
