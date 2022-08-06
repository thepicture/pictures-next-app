import type { NextApiRequest, NextApiResponse } from "next";

import { Server, Socket } from "socket.io";

import { Picture } from "@interfaces";
import { pictures } from "@persistency";
import {
  CONNECTION,
  DELETE_PICTURE_BY_NAME_AND_PASSWORD,
  INCORRECT_PASSWORD_FOR_DELETION,
  PICTURES,
  POST_PICTURE,
  SHOW_SNACKBAR,
} from "@constants";

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
    io.on(CONNECTION, (socket: Socket) => {
      socket.emit(PICTURES, mapPicturesToBeWithoutPassword(pictures));
      socket.on(POST_PICTURE, (newPictures: Picture[]) => {
        pictures.push(...newPictures);
        socket.broadcast.emit(
          POST_PICTURE,
          mapPicturesToBeWithoutPassword(newPictures)
        );
      });
      socket.on(
        DELETE_PICTURE_BY_NAME_AND_PASSWORD,
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
            socket.emit(SHOW_SNACKBAR, INCORRECT_PASSWORD_FOR_DELETION);
          } else {
            pictures.splice(pictureIndex, 1);
            io.emit(DELETE_PICTURE_BY_NAME_AND_PASSWORD, pictureIndex);
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
