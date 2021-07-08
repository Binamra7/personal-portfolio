import React from 'react';

import { Section, SectionText, SectionTitle  } from '../../styles/GlobalComponents';
import Button from '../../styles/GlobalComponents/Button';
import { LeftSection,Wrapper,StaticText,DynamicText, List, Span} from './HeroStyles';


const Hero = (props) => (
  <Section row nopadding>
    <LeftSection>
      <SectionTitle main center>

        {/* Hi. I am<br />
        Binamra Khadka */}


{/* <div className="wrapper" style={{display: 'flex'}}>
            <div className="static-txt">
              I'm a<br /></div>
            
            <ul className="dynamic-txts">
      <li><span>YouTuber</span></li>
      <li><span>Designer</span></li>
      <li><span>Developer</span></li>
      <li><span>Freelancer</span></li>
    </ul>
        </div>
        </Custom> */}
          
        Hi. I am<br/>Binamra Khadka
        

        {/* <Wrapper>
          <StaticText>
            <div style={{ color: 'red' }}>
              THIS IS   static text
              
            </div>
          </StaticText>

          <div style={{color:'white'}}>
            <DynamicText>
              <List>
                <ul className="dynamic-txts"></ul>
                <Span>YouTuber</Span>
                <Span>Designer</Span>
                <Span>Developer</Span>
                <Span>Freelancer</Span>
                </List>
            </DynamicText>
              </div>
        </Wrapper>
  
 */}
        


      </SectionTitle>

        

      <SectionText>
        The purpose of this portfolio is to make a personal site where I can show my skills and projects in a well-define manner.
      </SectionText>
      <Button>Learn More</Button>
    </LeftSection>
  </Section>
);

export default Hero;