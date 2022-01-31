import React from 'react';

import { BlogCard, CardInfo, ExternalLinks, GridContainer, HeaderThree, Hr, Tag, TagList, TitleContent, UtilityList, Img } from './ProjectsStyles';
import { Section, SectionDivider, SectionTitle } from '../../styles/GlobalComponents';
import { projects } from '../../constants/constants';
import { AiFillGithub, AiFillTwitterCircle,AiFillTwitterSquare, AiFillLinkedin,AiFillFacebook } from "react-icons/ai";


const Projects = () => (
  <Section nopadding id="projects" >
    <SectionDivider divider/>
    <SectionTitle main>Projects</SectionTitle>
    <GridContainer>
      {projects.map(({id, image, title, description, tags, source, visit}) => (
        <BlogCard key={id}>
          <Img src={image}/>
          <TitleContent>
            <HeaderThree title>{title}</HeaderThree>
            <Hr/>
          </TitleContent>
          <CardInfo>{description}</CardInfo>
          <div><br/>
            <TitleContent style={{color: '#38cc44',fontWeight: 'bold'}}>Stack</TitleContent>
            <TagList>
              {tags.map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
            </TagList>
          </div>
          <UtilityList>
            <ExternalLinks href={source} target="_blank">
              <div style={{display:'inline'}}>
                
              <AiFillGithub/>

              </div>
              &nbsp;Code
            </ExternalLinks>
            <ExternalLinks href={visit} target="_blank">Demo</ExternalLinks>

          </UtilityList>
        </BlogCard>
      ))}
    </GridContainer>
  </Section>
);

export default Projects;