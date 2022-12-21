export async function getFixtures(season: Number) {
  const response = await fetch(
    `${process.env.XG_URL!}/seasons/${season}/fixtures/`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.XG_KEY!,
        "X-RapidAPI-Host": process.env.XG_HOST!,
      },
    }
  );

  if (response.status !== 200) {
    throw response.status;
  }

  return await response.json();
}
