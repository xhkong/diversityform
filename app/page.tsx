"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Form from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {
  const handleSubmit = async ({ data }: any, event) => {
    console.log(data);
    console.log(event);
    try {
      const response = await client.models.FormSubmission.create({
        formId: formId,
        formData: JSON.stringify(data.formData)
      });
      console.log("Form submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const [formSchema, setFormSchema] = useState<RJSFSchema | null>(null);
  const [formId, setFormId] = useState<string | null>('b6a844f8-7e44-4885-ac6c-8e9f36e4dca3');
  const onboardForm = {
    "description": "Please provide your feedback to the Diversity Media Network Internship Onboarding Event that you attended, leave out your name if you want to remain anonymous.",
    "title": "Diversity Media Network Internship Onboarding Event Feedback Form",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string",
        "title": "First name"
      },
      "lastName": {
        "type": "string",
        "title": "Last name"
      },
      "ratingOverall": {
        "maximum": 5,
        "type": "integer",
        "title": "Overall Rating (1-5)",
        "minimum": 1
      },
      "feedback": {
        "type": "string",
        "title": "Feedback"
      }
    },
    "required": [
      "ratingOverall"
    ]
  }
  useEffect(() => {
    const fetchSchema = async () => {
      if(formId) {
        try {
          const { data: formData, errors } = await client.models.CustomForm.get({
            id: formId
          });
          if (errors) {
            console.error("Error fetching schema:", errors);
            return;
          }
          console.log('formData', formData);
          const loadedForm =  formData?.formFields ? JSON.parse(formData.formFields as string) : null;
          loadedForm['$id'] = formId;
          setFormSchema(loadedForm);
        } catch (error) {
          console.error("Error fetching schema:", error);
        }
      }
    };
  
    fetchSchema();
  }, []);

  return (
    <main>
      {formSchema && (
        <Form
          schema={formSchema}
          validator={validator}
          onChange={(data, id) => { console.log('changed', data, id); }}
          onSubmit={(data,event) => { console.log('submit', data, event); handleSubmit({ data }, event); }}
          onError={(errors) => { console.log('errors', errors); }}
        />
      )}
    </main>
  );
}
