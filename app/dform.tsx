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


export default function DForm({ id }: { id: string }) {
  const handleSubmit = async ({ data }: any) => {
    try {
      const response = await client.models.FormSubmission.create({
        formId: id,
        formData: JSON.stringify(data.formData)
      });
      if(response.data?.id) {
        window.location.href = '/success';
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } 
  };
  const [formSchema, setFormSchema] = useState<RJSFSchema | null>(null);
  const formParam = id;

  useEffect(() => {
    const fetchSchema = async () => {
      const firstChar = formParam.charAt(0);
      const inviteId = formParam.slice(1);
      var formId = null;
      if (firstChar === "E") {
        try {
          const { data: emailInvite, errors } = await client.models.EmailInvite.get({
            id: inviteId
          });
          if (errors) {
            console.error("Error fetching email invite:", errors);
            return;
          }
          if (emailInvite) {
            formId = emailInvite.formId;
          }
        } catch (error) {
          console.error("Error fetching email invite:", error);
        }
      } 
      if (firstChar === "P") {
        try {
          const { data: phoneInvite, errors } = await client.models.PhoneInvite.get({
            id: inviteId
          });
          if (errors) {
            console.error("Error fetching phone invite:", errors);
            return;
          }
          if (phoneInvite) {
            formId = phoneInvite.formId;
          }
        } catch (error) {
          console.error("Error fetching phone invite:", error);
        }
      }
      if(formId) {
        try {
          const { data: formData, errors } = await client.models.CustomForm.get({
            id: formId
          });
          if (errors) {
            console.error("Error fetching schema:", errors);
            return;
          }
          const loadedForm =  formData?.formFields ? JSON.parse(formData.formFields as string) : null;
          loadedForm['$id'] = formParam;
          setFormSchema(loadedForm);
        } catch (error) {
          console.error("Error fetching schema:", error);
        }
      }
    };
  
    fetchSchema();
  }, [formParam]);

  return (
    <main>
      {formSchema && (
        <Form
          schema={formSchema}
          validator={validator}
          onSubmit={(data,event) => { handleSubmit({ data }); }}
          onError={(errors) => { console.log('errors', errors); }}
        />
      )}
    </main>
  );
}
