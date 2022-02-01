import { Field, Form, Formik } from "formik";
import { useState } from "react";
import {
  FeedPostFragment,
  useCreateCommentMutation,
} from "../../graphql/generated/graphql";
import { MAX_TEXT_LENGTH } from "../../utis/constants";
import { mapToFormErrors } from "../../utis/mapToFormErrors";
import { HappyIcon } from "../Icons";

type Props = {
  post: FeedPostFragment;
  iconStyles: string;
};

export default function FeedCommentForm({ post, iconStyles }: Props) {
  const [loading, setLoading] = useState(false);
  const [, createComment] = useCreateCommentMutation();

  return (
    <Formik
      initialValues={{
        text: "",
      }}
      onSubmit={async (values, { resetForm }) => {
        setLoading(true);
        const response = await createComment({
          text: values.text,
          postId: post.id,
        });
        setLoading(false);
        if (response.data?.createComment.comment) {
          resetForm();
        }
        // need to handle errors here, although there shouldn't be many
      }}
    >
      {({ values }) => (
        <Form className="w-full flex items-center justify-center">
          {loading ? (
            <div className="h-12 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <>
              <HappyIcon className={iconStyles} />
              <Field
                type="text"
                id="text"
                name="text"
                placeholder="Add a comment..."
                className="outline-none w-full p-2"
                value={
                  values.text.length >= MAX_TEXT_LENGTH
                    ? values.text.substring(0, MAX_TEXT_LENGTH - 1)
                    : values.text
                }
                // prevent typing if max lengh reached
              />
              <button
                type="submit"
                className={`${
                  values.text.length === 0 ? "text-lightblue" : "text-blue"
                } p-2 font-semibold`}
                disabled={values.text.length === 0}
              >
                Post
              </button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}