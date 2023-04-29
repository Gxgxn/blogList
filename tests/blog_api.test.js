const mongoose = require("mongoose");

const supertest = require("supertest");
const app = require("../app.js");
const api = supertest(app);
const Blog = require("../model/blog.js");
const helper = require("./test_helper.js");
beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.blogs) {
    let newBlogObj = new Blog(blog);
    await newBlogObj.save();
  }
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

  // const response = await api
  //   .get("/api/blogs")
  //   .send(newBlog)
  //   .expect(201)
  //   .expect("Content-Type", /application\/json/);

  // expect(response.likes).toBeDefined().toEqual(0);

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
    title: "React patterns Test",
    author: "Michael Chan",
    // url: "https://reactpatterns.com/",
    likes: 7,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  await api.post("/api/blogs").send(newBlog2).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
