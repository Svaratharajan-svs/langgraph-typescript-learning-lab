import { expect, test } from "vitest";
import { agentApi } from "../src/graph/workflow.js";

test("Production Agent API", async () => {
  const key="test-fixture-key-1234"; const app=agentApi(key,async()=>"answer"); try { expect((await app.inject({method:"POST",url:"/run",payload:{text:"hi"}})).statusCode).toBe(401); const result=await app.inject({method:"POST",url:"/run",headers:{authorization:"Bearer "+key},payload:{text:"hi"}}); expect(result.json().answer).toBe("answer"); const stream=await app.inject({method:"POST",url:"/stream",headers:{authorization:"Bearer "+key},payload:{text:"hi"}}); expect(stream.body).toContain("event: custom"); } finally {await app.close();}
});
