import React from "react";
import {Card} from "antd";
import {ListGroup, ListGroupItem, Button} from "reactstrap";

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
    <Card title="Feeds">
        <ListGroup flush>
          {FeedData.map((feed, index) => (
            <ListGroupItem
              key={index}
              action
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
    </Card>
  );
};

export default Feeds;
