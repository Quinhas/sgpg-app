// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from "@services/api";
import { students } from "@utils/data";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const resRoles: any[] = await Promise.all(
    students.map(async (data) => {
      return (await api.apiService.post("/students", data)).data;
    })
  );
  res.status(200).json({ data: resRoles });
}
