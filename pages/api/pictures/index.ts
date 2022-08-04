import type { NextApiRequest, NextApiResponse } from "next";

import { Server, Socket } from "socket.io";

import { Picture } from "@interfaces";

import { pictures } from "@persistency";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Picture[]>
) {
  const responseSocket = res.socket as any;
  if (!responseSocket.server.io) {
    const io = new Server(responseSocket.server);
    responseSocket.server.io = io;
    io.on("connection", (socket: Socket) => {
      socket.emit("pictures", pictures);
      socket.on("post picture", (newPictures: Picture[]) => {
        pictures.push(...newPictures);
        socket.broadcast.emit("post picture", newPictures);
      });
      socket.on("delete picture by name", (pictureName: string) => {
        const pictureIndex = pictures.findIndex(
          (picture) => picture.name === pictureName
        );
        pictures.splice(pictureIndex, 1);
        socket.broadcast.emit("delete picture by name", pictureIndex);
      });
    });
  }
  res.end();
}
