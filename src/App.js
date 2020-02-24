import React, { useEffect, useState, useRef } from 'react';
import { Form } from '@unform/web';
import { Scope } from '@unform/core';
import Input from './components/Form/input';
import * as Yup from 'yup';

/*
const initialData = {
  email: 'marcelotc@gmail.com',
  address: {
    city: 'a'
  }
}*/

function App() {
  const formRef = useRef(null);

  async function handleSubmit(data, { reset }) {
    /* if (data.name === "") {
       formRef.current.setErrors({
         name: 'O nome é obrigatório',
         address: {
           city: 'A cidade é obrigatória'
         }
       });
     }*/
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('O e-mail é obrigaótio'),
        address: Yup.object().shape({
          city: Yup.string()
            .min(3, 'No mínimo 3 caracteres')
            .required('A cidade é obrigatória.')
        })
      });

      await schema.validate(data, { abortEarly: false /* Passa por todas as validações */ })

      console.log(data);

      formRef.current.setErrors({});
      reset();

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        })

        formRef.current.setErrors(errorMessages);
        console.log(err);
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      formRef.current.setData({
        name: 'Marcelo Cortes',
        email: 'marcelo@gmail.com',
        address: {
          city: 'Floripa'
        }
      })
    }, 2000)
  }, [])

  return (
    <div className="App">
      <Form ref={formRef} /*initialData={initialData}*/ onSubmit={handleSubmit}>
        <Input name="name"></Input>
        <Input type="email" name="email"></Input>
        <Scope path="address">
          <Input name="street"></Input>
          <Input name="number"></Input>
          <Input name="city"></Input>
          <Input name="state"></Input>
        </Scope>
        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}

export default App;
