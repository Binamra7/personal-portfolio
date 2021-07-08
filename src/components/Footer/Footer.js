import React from 'react';
import { AiFillGithub, AiFillFacebook, AiFillLinkedin,AiFillTwitterCircle } from 'react-icons/ai';

import { SocialIcons } from '../Header/HeaderStyles';
import { CompanyContainer, FooterWrapper, LinkColumn, LinkItem, LinkList, LinkTitle, Slogan, SocialContainer, SocialIconsContainer } from './FooterStyles';

import Copy from '../Copy/Copy';

const Footer = () => {
  return (
    <div id='contact'>
      <FooterWrapper>
          <div>
          <p>
          <h1 style={{color: 'skyblue'}}>Contact me !</h1>
            </p>
        
          </div>
        <LinkList>
        <LinkColumn>
          <LinkTitle>
            Call
          </LinkTitle>
          <LinkItem href="tel:+977-9869327496">9869327496</LinkItem>
        </LinkColumn>
        <LinkColumn>
          <LinkTitle>
            Email
          </LinkTitle>
          <LinkItem href="mailto:binamra7khadka6@gmail.com" target="_blank">binamra7khadka6@gmail.com</LinkItem>
        </LinkColumn>
      </LinkList>
        <SocialIconsContainer>
          
        <CompanyContainer>
          {/* <Slogan>
          Innovating one project at a time
          </Slogan> */}
          </CompanyContainer>
          
        <SocialContainer>
        <SocialIcons href="https://github.com/binamra7" target="_blank">
        <AiFillGithub size="3rem" />
      </SocialIcons>
      <SocialIcons href="https://www.linkedin.com/in/binamra-khadka-1502a3209/" target="_blank">
        <AiFillLinkedin size="3rem" />
      </SocialIcons>
      <SocialIcons href="https://twitter.com/whobinam" target="_blank">
        <AiFillTwitterCircle size="3rem" />
          </SocialIcons>
          <SocialIcons href="https://facebook.com/whoBinamrakhadka" target="_blank">
        <AiFillFacebook size="3rem" />
      </SocialIcons>
          </SocialContainer>
      </SocialIconsContainer>
     
      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
      
      </FooterWrapper>
      {/* <div style={{ }} > */}
        <Copy/>
        {/* </div> */}
      </div>
  );
};

export default Footer;
