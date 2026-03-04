import type { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { createMessage, deleteMessageById } from "../db/messages.js";

type NewMessageFormData = {
  title: string;
  text: string;
};

type NewMessageViewModel = {
  formData: NewMessageFormData;
  fieldErrors: Record<string, string>;
  formError: string;
};

const getNewMessage: RequestHandler = (_req, res) => {
  const viewModel: NewMessageViewModel = {
    formData: {
      title: "",
      text: "",
    },
    fieldErrors: {},
    formError: "",
  };

  res.render("messages/new", viewModel);
};

const postNewMessage: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  const formData: NewMessageFormData = {
    title: String(req.body.title ?? ""),
    text: String(req.body.text ?? ""),
  };

  if (!errors.isEmpty()) {
    const fieldErrors: Record<string, string> = {};

    for (const error of errors.array()) {
      if (error.type === "field" && !fieldErrors[error.path]) {
        fieldErrors[error.path] = error.msg;
      }
    }

    const viewModel: NewMessageViewModel = {
      formData,
      fieldErrors,
      formError: "",
    };

    return res.status(400).render("messages/new", viewModel);
  }

  const currentUser = req.user as { id?: number } | undefined;

  if (!currentUser?.id) {
    return res.redirect("/auth/login");
  }

  try {
    await createMessage({
      title: formData.title,
      text: formData.text,
      authorId: currentUser.id,
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);

    const viewModel: NewMessageViewModel = {
      formData,
      fieldErrors: {},
      formError: "Could not create message. Please try again.",
    };

    return res.status(500).render("messages/new", viewModel);
  }
};

const postDeleteMessage: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send(String(errors.array()[0]?.msg ?? "Invalid input."));
  }

  const messageId = Number(req.params.id);
  const didDelete = await deleteMessageById(messageId);

  if (!didDelete) {
    return res.status(404).send("Message not found.");
  }

  return res.redirect("/");
};

export { getNewMessage, postNewMessage, postDeleteMessage };
