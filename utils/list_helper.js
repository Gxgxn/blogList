const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};
const mostBlogs = (blogs) => {
  const authorCountObj = blogs.reduce((acc, curr) => {
    if (!acc[curr.author]) acc[curr.author] = 0;
    acc[curr.author]++;
    return acc;
  }, {});
  console.log(authorCountObj);

  if (!Object.keys(authorCountObj).length) return null;
  const authorHighestCount = Object.keys(authorCountObj).reduce((acc, curr) =>
    authorCountObj[acc] > authorCountObj[curr] ? acc : curr
  );
  return {
    author: authorHighestCount,
    blogs: authorCountObj[authorHighestCount],
  };
};

const mostLikes = (blogs) => {
  const authorCountObj = blogs.reduce((acc, curr) => {
    if (!acc[curr.author]) acc[curr.author] = 0;
    acc[curr.author] += curr.likes;
    return acc;
  }, {});

  if (!Object.keys(authorCountObj).length) return null;
  const authorHighestCount = Object.keys(authorCountObj).reduce((acc, curr) =>
    authorCountObj[acc] > authorCountObj[curr] ? acc : curr
  );
  return {
    author: authorHighestCount,
    likes: authorCountObj[authorHighestCount],
  };
};

const favoriteBlog = (blogs) => {
  if (blogs.length !== 0) {
    const obj = blogs.reduce((acc, curr) =>
      acc.likes > curr.likes ? acc : curr
    );
    return {
      author: obj.author,
      likes: obj.likes,
    };
  } else {
    return null;
  }
};
module.exports = {
  totalLikes,
  dummy,
  mostBlogs,
  favoriteBlog,
  mostLikes,
};
