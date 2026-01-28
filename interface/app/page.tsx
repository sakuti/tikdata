"use client"

import { useEffect } from "react";

export default function () {
  useEffect(() => {
    alert("Hello World!")
  }, [])

  return (
    <h1>tikdata web interface</h1>
  );
}
