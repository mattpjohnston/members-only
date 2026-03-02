import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { createUser } from "../db/users.js";

type SignUpFormData = {
  first_name: string;
  last_name: string;
  email: string;
};

type SignUpViewModel = {
  formData: SignUpFormData;
  fieldErrors: Record<string, string>;
  formError: string;
};

const getSignUp: RequestHandler = (_req, res) => {
  const viewModel: SignUpViewModel = {
    formData: {
      first_name: "",
      last_name: "",
      email: "",
    },
    fieldErrors: {},
    formError: "",
  };

  res.render("auth/sign-up", viewModel);
};

const postSignUp: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  const formData: SignUpFormData = {
    first_name: String(req.body.first_name ?? ""),
    last_name: String(req.body.last_name ?? ""),
    email: String(req.body.email ?? ""),
  };

  if (!errors.isEmpty()) {
    const fieldErrors: Record<string, string> = {};

    for (const error of errors.array()) {
      if (error.type === "field" && !fieldErrors[error.path]) {
        fieldErrors[error.path] = error.msg;
      }
    }

    const viewModel: SignUpViewModel = {
      formData,
      fieldErrors,
      formError: "",
    };

    return res.status(400).render("auth/sign-up", viewModel);
  }

  try {
    const passwordHash = await bcrypt.hash(String(req.body.password), 10);

    await createUser({
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      passwordHash,
    });

    return res.redirect("/auth/login");
  } catch (error) {
    const dbError = error as { code?: string };
    const viewModel: SignUpViewModel = {
      formData,
      fieldErrors: {},
      formError: "Could not create your account. Please try again.",
    };

    if (dbError.code === "23505") {
      viewModel.fieldErrors.email = "Email is already in use";
      viewModel.formError = "";
    }

    return res.status(400).render("auth/sign-up", viewModel);
  }
};

export { getSignUp, postSignUp };
