import styled from 'styled-components';

export const LeftSection = styled.div`
  width: 100%;
  @media ${(props) => props.theme.breakpoints.sm} {
    width: 80%;
    display: flex;
    flex-direction: column;

    margin: 0 auto;
  }
  @media ${(props) => props.theme.breakpoints.md} {
    width: 100%;
    display: flex;
    flex-direction: column;

    margin: 0 auto;
  }
`;
export const Wrapper = styled.div`
  display: flex;
}`;


export const StaticText = styled.div`

  
  font-size: 60px;
  font-weight: 400;
}`;

export const DynamicText = styled.div`
  margin-left: 15px;
  height: 90px;
  line-height: 90px;
  overflow: hidden;
}`;
export const List = styled.div`
  list-style: none;
  color: #fff;
  font-size: 60px;
  z-index:999;
  font-weight: 500;
  position: relative;
  top: 0;
  animation: slide 12s steps(4) infinite;
}
@keyframes slide {
  100%{
    top: -360px;
  }
}`;

export const Span=styled.div`
.dynamic-txts li span{
  position: relative;
  margin: 5px 0;
  line-height: 90px;
}
.dynamic-txts li span::after{
  content: "";
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  background: #000;
  border-left: 2px solid #FC6D6D;
  animation: typing 3s steps(10) infinite;
}
@keyframes typing {
  40%, 60%{
    left: calc(100% + 30px);
  }
  100%{
    left: 0;
  }
}
`;