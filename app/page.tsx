"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

Amplify.configure(outputs);

const client = generateClient<Schema>();


const schema: RJSFSchema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
};

export default function App() {


  useEffect(() => {

  }, []);



  return (
    <main>
      <Form
        schema={schema}
        validator={validator}
        onChange={(data, id) => { console.log('changed', data, id); }}
        onSubmit={(data, event) => { console.log('submitted', data, event); }}
        onError={(errors) => { console.log('errors', errors); }}
      />
    </main>
  );
}
