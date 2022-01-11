import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../types/Post";
import { Context } from "../../context";
import { PostResponse } from "../types/PostResponse";

@Resolver()
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Post])
  posts(@Ctx() { prisma }: Context): Promise<Post[]> {
    return prisma.post.findMany();
  }

  @Mutation(() => Post)
  createPost(
    @Arg("caption") caption: string,
    @Ctx() { prisma }: Context
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        caption: caption,
      },
    });
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("caption") caption: string,
    @Ctx() { prisma }: Context
  ): Promise<PostResponse> {
    try {
      const post = await prisma.post.update({
        where: {
          id: id,
        },
        data: {
          caption: caption,
        },
      });
      return {
        post,
      };
    } catch (error) {
      if (error.code === "P2025") {
        return {
          errors: [
            {
              field: "id",
              message: "That post doesn't exist",
            },
          ],
        };
      }
      throw error;
    }
  }

  @Mutation(() => PostResponse)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: Context
  ): Promise<PostResponse> | null {
    try {
      const post = await prisma.post.delete({
        where: {
          id: id,
        },
      });
      return {
        post,
      };
    } catch (error) {
      if (error.code === "P2025") {
        return {
          errors: [
            {
              field: "id",
              message: "That post doesn't exist",
            },
          ],
        };
      }
      throw error;
    }
  }
}
