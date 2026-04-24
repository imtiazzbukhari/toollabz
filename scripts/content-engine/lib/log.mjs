/** @param {Record<string, unknown>} row */
export function pipelineLog(row) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), service: "content-engine-pipeline", ...row }));
}
