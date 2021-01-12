import {gql} from '@apollo/client';

export const ALL_QUESTIONS = gql`
    query questions {
  questions
  {
    _id
    question
    answers{
        answer
        points
    }
  }
}
`;