import { AlarmLableMap } from "@/types/maps";
import { AlarmType } from "@/types/tag.enum";

import styled from "styled-components";

export interface IAlarmProps {
  alarmType: AlarmType;
  createdAt: string;
  username: string;
}

const Alarm = ({ alarmType, createdAt, username }: IAlarmProps) => {
  const content = AlarmLableMap[alarmType];

  return (
    <Container>
      <AlarmContentStyled>
        {content} {username}
      </AlarmContentStyled>
      <AlarmWrapper>{createdAt}</AlarmWrapper>
    </Container>
  );
};

export default Alarm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px 40px;
  border-radius: 10px;
  width: 100%;
  max-width: 792px;
  gap: 14px;
  border: 1px solid var(--black);
  background-color: "var(--white)";
`;

const AlarmContentStyled = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
`;

const AlarmWrapper = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  color: #696969;
`;
