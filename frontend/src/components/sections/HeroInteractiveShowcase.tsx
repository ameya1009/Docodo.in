"use client";

import React from "react";
import { MockupVideoShowcase, MockupVideoShowcaseProps } from "./MockupVideoShowcase";

/**
 * HeroInteractiveShowcase is an alias wrapper around MockupVideoShowcase.
 * Completely replaces legacy 3D canvas and WebGL representations with a realistic,
 * high-definition interactive clinic SaaS video walkthrough.
 */
export const HeroInteractiveShowcase: React.FC<MockupVideoShowcaseProps> = (props) => {
  return <MockupVideoShowcase {...props} />;
};

export { MockupVideoShowcase };
export default HeroInteractiveShowcase;
