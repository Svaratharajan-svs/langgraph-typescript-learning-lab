import { expect, test } from "vitest";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { support } from "../src/graph/workflow.js";

test("PostgreSQL Persistence", async () => {
  const saver=new MemorySaver(); const options={configurable:{thread_id:"recovery"}}; await support(saver).invoke({messages:[new HumanMessage("Order 42")]},options); expect((await support(saver).getState(options)).values.messages[0].text).toBe("Order 42");
});
