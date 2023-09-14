import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { startRegistration } from '@simplewebauthn/browser';
import { VERIFY_REGISTRATION } from '../graphql/mutations';
import { GENERATE_REGISTRATION } from '../graphql/queries';

const Authentication = () => {
  const { error, data } = useQuery(GENERATE_REGISTRATION);
  const [verified, setVerified] = useState(false);
  const [options, setOptions] = useState({
    response: {},
    expectedChallenge: '',
    expectedOrigin: '',
    expectedRPID: '',
    requireUserVerification: true,
  });

  const [verifyRegistration] = useMutation(VERIFY_REGISTRATION, {
    onCompleted: (res): void => {
      setVerified(res.verifyRegistration.options.verified);
    },
    onError: (err): void => {
      console.error(err);
    },
  });

  useEffect(() => {
    if (data?.generateRegistration) {
      const opts = data.generateRegistration.options;
      const credential = startRegistration(opts);
      credential
        .then((res) => {
          options.response = res;
          options.expectedChallenge = opts.challenge;
          options.expectedOrigin = data.generateRegistration.url;
          options.expectedRPID = opts.rp.id;
          setOptions((prev) => ({ ...prev }));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [data, error]);

  useEffect(() => {
    if (options.expectedOrigin !== '') {
      verifyRegistration({ variables: { options } })
        .then((r) => console.log(r))
        .catch((err) => console.error(err));
    }
  }, [options]);

  return (
    <>
      <div>authentication</div>
      {(() => {
        const length = Object.keys(options.response).length;
        return (
          <>
            {verified ? (
              <div>Authentication registered!</div>
            ) : (
              length > 0 && <div>Authentication failed</div>
            )}
          </>
        );
      })()}
    </>
  );
};

export default Authentication;
