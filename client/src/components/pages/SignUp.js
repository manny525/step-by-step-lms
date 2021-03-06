import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import LoginNavbar from '../LoginNavbar';
import register from '../../apiCalls/register';
import { setUser } from '../../store/actions/user';

export default function SignUp(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Select Type');
  const [standard, setStandard] = useState('Select Standard');
  const [section, setSection] = useState('Select Section');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const dispatch = useDispatch();
  function handleSubmit() {
    const user = {
      name, email, password, password2: confirmPassword
    };
    if (standard != 'Select Standard') {
      user.standard = standard
    }
    if (section != 'Select Section') {
      user.section = section
    }
    register(user, userType)
      .then(result => {
        dispatch(setUser(result));
        console.log('SUCCESS!');
        console.log(result);
        props.history.push(`/${userType.toLowerCase()}/home`);
      })
      .catch(err => { console.log(err); setMessage(err.toString()) });
  }

  const [message, setMessage] = useState(null)

  return (
    <div>
      <LoginNavbar />
      <div style={{ textAlign: 'center' }}>
        <h1>Take the first step towards learning</h1>
      </div>
      <div className="login-form">
        <Form onSubmit={handleSubmit} >
          <h2>Sign Up</h2>
          <Form.Group controlId="usertype">
            <Form.Label>User Type</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {userType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={() => { setUserType('Student') }} >Student</Dropdown.Item>
                <Dropdown.Item onSelect={() => { setUserType('Teacher') }} >Teacher</Dropdown.Item>
                <Dropdown.Item onSelect={() => { setUserType('Parent') }} >Parent</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Name" />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" placeholder="Password" />
          </Form.Group>
          {
            userType == 'Student' ?
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {standard}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onSelect={() => { setStandard('Prep') }} >Prep</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('1st') }} >1st</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('2nd') }} >2nd</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('3rd') }} >3rd</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('4th') }} >4th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('5th') }} >5th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('6th') }} >6th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('7th') }} >7th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('8th') }} >8th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('9th') }} >9th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('10th') }} >10th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('11th') }} >11th</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setStandard('12th') }} >12th</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown style={{ paddingLeft: '0.5%' }}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {section}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onSelect={() => { setSection('A') }} >A</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setSection('B') }} >B</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setSection('C') }} >C</Dropdown.Item>
                    <Dropdown.Item onSelect={() => { setSection('D') }} >D</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div> : <></>
          }
          <Form.Group controlId="formBasicCheckbox" style={{ marginBottom: '1%' }}>
            <Form.Check type="checkbox" label="I agree to all terms and conditions" onChange={(e) => { setAcceptTerms(!acceptTerms) }} />
          </Form.Group>
        </Form >
        <Button onClick={handleSubmit} variant="dark" type="submit">
          SignUp
        </Button>
        {message && <div className="info info-danger">{message}</div>}
      </div>
    </div>
  )
}
