import styled from "styled-components";

export const Form = styled.form`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.2s;
  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  background-color: #0070f3;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0059c9;
  }
`;
