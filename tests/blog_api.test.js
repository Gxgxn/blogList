const mongoose = require("mongoose");

const supertest = require("supertest");
const app = require("../app.js");
const api = supertest(app);
const Blog = require("../model/blog.js");
const helper = require("./test_helper.js");
const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.blogs) {
    let newBlogObj = new Blog(blog);
    await newBlogObj.save();
  }
  //   const noteObjects = helper.initialNotes
  //   .map(note => new Note(note))
  // const promiseArray = noteObjects.map(note => note.save())
  // await Promise.all(promiseArray)
});

test("getting length of stored blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .expect("Content-Type", /application\/json/);
  expect(response.body).toHaveLength(helper.blogs.length);
});

test("check if unique identifier id exists, i.e. _id => id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect("Content-Type", /application\/json/);
  expect(response.body[0].id).toBeDefined();
});

test("check if a blog saved", async () => {
  const newBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const notesInDB = await helper.getAllBlogsInDB();

  expect(notesInDB).toHaveLength(helper.blogs.length + 1);
});

test("like property defaults to 0 if not provided", async () => {
  const newBlog = {
    title: "React patterns Test",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    // likes: 7,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.getAllBlogsInDB();
  const addedBlog = await blogsAtEnd.find(
    (blog) => blog.title === "React patterns Test"
  );
  expect(addedBlog.likes).toBe(0);
});

test("wont save without a valid title or url", async () => {
  const newBlog = {
    // title: "React patterns Test",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  };
  const newBlog2 = {
    // title: "React patterns Test",
    author: "Michael Chan",
    // url: "https://reactpatterns.com/",
    likes: 7,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  await api.post("/api/blogs").send(newBlog2).expect(400);
});
describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const currentBlogs = await helper.getAllBlogsInDB();
    const blogToDelete = currentBlogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.getAllBlogsInDB();

    expect(blogsAtEnd).toHaveLength(currentBlogs.length - 1);

    const contents = blogsAtEnd.map((r) => r.content);

    expect(contents).not.toContain(blogToDelete);
  });
});
test("updating likes on blog with an id", async () => {
  const notesAtStart = await helper.getAllBlogsInDB();

  const noteToUpdated = notesAtStart[1];
  noteToUpdated.likes++;
  const resultNote = await api
    .put(`/api/blogs/${noteToUpdated.id}`)
    .send(noteToUpdated)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resultNote.body.likes).toEqual(noteToUpdated.likes);
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await list_helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
