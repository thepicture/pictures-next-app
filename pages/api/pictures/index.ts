import type { NextApiRequest, NextApiResponse } from "next";

import { Server, Socket } from "socket.io";

import { Picture } from "@interfaces";

import { pictures } from "@persistency";

export interface PictureDeletionCredentials {
  pictureName: string;
  passwordForExistingPictureDeletion: string;
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Picture[]>
) {
  const responseSocket = res.socket as any;
  if (!responseSocket.server.io) {
    const io = new Server(responseSocket.server);
    responseSocket.server.io = io;
    io.on("connection", (socket: Socket) => {
      socket.emit("pictures", mapPicturesToBeWithoutPassword(pictures));
      socket.on("post picture", (newPictures: Picture[]) => {
        pictures.push(...newPictures);
        socket.broadcast.emit(
          "post picture",
          mapPicturesToBeWithoutPassword(newPictures)
        );
      });
      socket.on(
        "delete picture by name",
        ({
          pictureName,
          passwordForExistingPictureDeletion,
        }: PictureDeletionCredentials) => {
          const pictureIndex = pictures.findIndex(
            (picture) => picture.name === pictureName
          );
          const canDeletePicture =
            !!pictures[pictureIndex].passwordForDeletion &&
            !!passwordForExistingPictureDeletion &&
            pictures[pictureIndex].passwordForDeletion ===
              passwordForExistingPictureDeletion;
          if (!canDeletePicture) {
            socket.emit("show snackbar", "Incorrect password for deletion");
          } else {
            pictures.splice(pictureIndex, 1);
            io.emit("delete picture by name", pictureIndex);
          }
        }
      );
    });
  }
  res.end();
}

const mapPicturesToBeWithoutPassword = (pictures: Picture[]) =>
  pictures.map((picture) => {
    const securePicture = Object.assign({}, picture);
    delete securePicture.passwordForDeletion;
    return securePicture;
  });
