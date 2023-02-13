import { assert } from 'chai';
import { decodeToken } from '../../../src/services/auth/token.js';

const sampleToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI0OWM1MDYyZDg5MGY1Y2U0NDllODkwYzg4ZThkZDk4YzRmZWUwYWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzYyNDkwMzEsImF1ZCI6IjEwNDkyNzc4MDA2MjgtZGp2bnQzMm4wb2RmMDdrcWVsa24xdDBpZWUzM2trMG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE2OTEyMDUxNjQ5NzcxNTI5ODIiLCJlbWFpbCI6ImNvZGVjaGFtcHBvZ2dlcnNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjEwNDkyNzc4MDA2MjgtZGp2bnQzMm4wb2RmMDdrcWVsa24xdDBpZWUzM2trMG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiQ29kZSBDaGFtcCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BRWRGVHA2YXRGR3RzSFpSOFZBX2JYMEZvdVZ5NGxxZl9TYjdKM2xjbUJQRT1zOTYtYyIsImdpdmVuX25hbWUiOiJDb2RlIiwiZmFtaWx5X25hbWUiOiJDaGFtcCIsImlhdCI6MTY3NjI0OTMzMSwiZXhwIjoxNjc2MjUyOTMxLCJqdGkiOiI1ZGQ1NzU2NTE0ZDljMjRmYmYxZTU0NTIxNjUyMDVkMTUxNTE1MzE1In0.KRqM4JMGGlzZpzlcpmvqV3oivCElFqgzEiFLCCgFihalavNbiO5h0yA-o5wBm49Vzq78E0FxL1cgYXTuJxsVYuuqORMsLeCGYiHYZNhDc_5k1fcE-OlmyitOlxL-3PGKLghM1kDrW9s_qDserGneI9mOC_RUMuWHkIrIaaf1WF-U7xi6B90u7UAYZnIcWi9fkYO01FGAO7QVSQRChFULA1T1Xm7joloOwfdUjsPVidox4-LKrjhfoK1hhhrbBQ-OGU-dpKoWLKQFYKHfGVgu6SbTJT5sO6SgBUYcBRZyKPHJw2nLVGo_TD4ZPnO8BQ5upypVsOjKuoDfKVNRPiAbFw';

describe('Token', () => {
  describe('#decodeToken()', () => {
    it('should contain necessary fields: name, email and picture', () => {
      const { name, picture, email } = decodeToken(sampleToken);
      assert.equal(name, 'Code Champ');
      assert.equal(
        picture,
        'https://lh3.googleusercontent.com/a/AEdFTp6atFGtsHZR8VA_bX0FouVy4lqf_Sb7J3lcmBPE=s96-c'
      );
      assert.equal(email, 'codechamppoggers@gmail.com');
    });
  });
});
