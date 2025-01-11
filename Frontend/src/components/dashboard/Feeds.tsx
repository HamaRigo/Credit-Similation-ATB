import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
  Button,
} from "reactstrap";

const FeedData = [
  {
    title: "Notification #1",
    icon: "bi bi-bell",
    color: "light",
    date: "1 minute ago",
  },
  {
    title: "Notification #2",
    icon: "bi bi-hdd",
    color: "warning",
    date: "5 minutes ago",
  },
  {
    title: "Notification #3",
    icon: "bi bi-hdd",
    color: "danger",
    date: "10 minutes ago",
  },
  {
    title: "Notification #4",
    icon: "bi bi-bell",
    color: "dark",
    date: "15 minutes ago",
  },
];

const Feeds = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Feeds</CardTitle>
        <ListGroup flush className="mt-4">
          {FeedData.map((feed, index) => (
            <ListGroupItem
              key={index}
              action
              href="/"
              tag="a"
              className="d-flex align-items-center p-3 border-0"
            >
              <Button
                className="rounded-circle me-3"
                size="sm"
                color={feed.color}
              >
                <i className={feed.icon}></i>
              </Button>
              {feed.title}
              <small className="ms-auto text-muted text-small">
                {feed.date}
              </small>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

export default Feeds;
