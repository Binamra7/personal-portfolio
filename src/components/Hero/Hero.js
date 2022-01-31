import React from "react";

import {
  Section,
  SectionDivider,
  SectionText,
  SectionTitle,
} from "../../styles/GlobalComponents";

import Button from "../../styles/GlobalComponents/Button";

import {
  LeftSection,
  Wrapper,
  StaticText,
  DynamicText,
  List,
  Span,
} from "./HeroStyles";

const Hero = (props) => (
  <Section row nopadding>
    <LeftSection>
      <SectionTitle main center>
        Hi. I am
        <br />
        <SectionDivider style={{ width: "25rem" }} />
        Binamra Khadka
      </SectionTitle>
      <SectionText>
        The purpose of this portfolio is to make a personal site where I can
        show my skills <br/>and some of my personal projects.
      </SectionText>
      <Button>Learn More</Button>
    </LeftSection>
  </Section>
);

export default Hero;
