import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { db } from "@/lib/db"
import {
  getBoardsByUser,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "@/lib/repositories/board"

// These IDs are fixed so cleanup is deterministic even if a test crashes mid-run.
const USER_A_ID = "test-user-a"
const USER_B_ID = "test-user-b"

beforeAll(async () => {
  // Create two real User rows. upsert avoids failures if a previous test run
  // crashed before the afterAll cleanup ran.
  await db.user.upsert({
    where: { id: USER_A_ID },
    update: {},
    create: { id: USER_A_ID, email: "user-a@test.com", name: "User A" },
  })
  await db.user.upsert({
    where: { id: USER_B_ID },
    update: {},
    create: { id: USER_B_ID, email: "user-b@test.com", name: "User B" },
  })
})

afterEach(async () => {
  // Wipe all boards between tests so state doesn't bleed across cases.
  await db.board.deleteMany({
    where: { userId: { in: [USER_A_ID, USER_B_ID] } },
  })
})

afterAll(async () => {
  // Remove the test users (boards are already gone from afterEach).
  await db.user.deleteMany({
    where: { id: { in: [USER_A_ID, USER_B_ID] } },
  })
  await db.$disconnect()
})

// ---------------------------------------------------------------------------

describe("getBoardsByUser", () => {
  it("returns only boards owned by the given user", async () => {
    await createBoard(USER_A_ID, "A's board")
    await createBoard(USER_B_ID, "B's board")

    const boards = await getBoardsByUser(USER_A_ID)

    expect(boards).toHaveLength(1)
    expect(boards[0].title).toBe("A's board")
  })

  it("returns an empty array when the user has no boards", async () => {
    const boards = await getBoardsByUser(USER_A_ID)
    expect(boards).toHaveLength(0)
  })

  it("returns boards newest-first", async () => {
    await createBoard(USER_A_ID, "First")
    await createBoard(USER_A_ID, "Second")

    const boards = await getBoardsByUser(USER_A_ID)

    expect(boards[0].title).toBe("Second")
    expect(boards[1].title).toBe("First")
  })
})

// ---------------------------------------------------------------------------

describe("getBoard", () => {
  it("returns the board when it exists and belongs to the user", async () => {
    const created = await createBoard(USER_A_ID, "My board")
    const found = await getBoard(USER_A_ID, created.id)

    expect(found).not.toBeNull()
    expect(found?.title).toBe("My board")
  })

  it("returns null for a board that belongs to a different user", async () => {
    const created = await createBoard(USER_A_ID, "A's private board")
    // User B tries to look up User A's board — should get null, not the board.
    const found = await getBoard(USER_B_ID, created.id)

    expect(found).toBeNull()
  })

  it("returns null for a board ID that doesn't exist", async () => {
    const found = await getBoard(USER_A_ID, "non-existent-id")
    expect(found).toBeNull()
  })
})

// ---------------------------------------------------------------------------

describe("createBoard", () => {
  it("creates a board and returns it with the correct userId", async () => {
    const board = await createBoard(USER_A_ID, "New board")

    expect(board.title).toBe("New board")
    expect(board.userId).toBe(USER_A_ID)
    expect(board.id).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------

describe("updateBoard", () => {
  it("renames a board the user owns", async () => {
    const board = await createBoard(USER_A_ID, "Old title")
    await updateBoard(USER_A_ID, board.id, "New title")

    const fetched = await db.board.findUnique({ where: { id: board.id } })
    expect(fetched!.title).toBe("New title")
  })

  it("throws when a user tries to rename another user's board", async () => {
    const board = await createBoard(USER_A_ID, "A's board")

    // User B attempting to rename User A's board must be rejected.
    await expect(
      updateBoard(USER_B_ID, board.id, "Hijacked title")
    ).rejects.toThrow("Board not found or access denied")
  })
})

// ---------------------------------------------------------------------------

describe("deleteBoard", () => {
  it("deletes a board the user owns", async () => {
    const board = await createBoard(USER_A_ID, "To delete")
    await deleteBoard(USER_A_ID, board.id)

    const found = await getBoard(USER_A_ID, board.id)
    expect(found).toBeNull()
  })

  it("throws when a user tries to delete another user's board", async () => {
    const board = await createBoard(USER_A_ID, "A's board")

    // User B must not be able to delete User A's board.
    await expect(deleteBoard(USER_B_ID, board.id)).rejects.toThrow(
      "Board not found or access denied"
    )

    // Confirm the board still exists after the failed attempt.
    const found = await getBoard(USER_A_ID, board.id)
    expect(found).not.toBeNull()
  })
})
