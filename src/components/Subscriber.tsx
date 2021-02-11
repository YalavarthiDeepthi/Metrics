import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSubscription } from "@apollo/react-hooks";
import { actions } from '../Features/Weather/reducer';
import gql from 'graphql-tag';

const newMessages = gql`
  subscription onNewMeasurement{
    newMeasurement{
      metric,
      at,
      value,
      unit
    }
  }
  `;

export default () => {
  const dispatch = useDispatch();

  const subscriptionResponse = useSubscription(newMessages);

  useEffect(() => {
    //dispatch actions to store the new measurements in store
    if (!subscriptionResponse) return;
    dispatch(actions.storeNewMeasurement(subscriptionResponse));
  }, [subscriptionResponse]);

  return null;
};
