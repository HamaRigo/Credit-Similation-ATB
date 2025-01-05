import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

const Grid = ({ title, rows }) => {
  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          {title || 'Dynamic Grid Layout'}
        </CardTitle>
        <CardBody>
          <Container>
            {rows.map((row, rowIndex) => (
              <Row key={`row-${rowIndex}`} className={row.className || 'mt-3'}>
                {row.columns.map((col, colIndex) => (
              <Col
                    key={`col-${rowIndex}-${colIndex}`}
                    xs={col.xs}
                    sm={col.sm}
                    md={col.md}
                    lg={col.lg}
                    xl={col.xl}
                    className={col.className}
                    style={col.style}
              >
                    <div
                      className={col.innerClassName || 'bg-light p-2 border'}
                      style={col.innerStyle}
              >
                      {col.content || `.col-${col.xs || ''}`}
                </div>
              </Col>
                ))}
            </Row>
            ))}
          </Container>
        </CardBody>
      </Card>
    </div>
  );
};

// Prop Types for validation
Grid.propTypes = {
  title: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          xs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          sm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          md: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          lg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          xl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          className: PropTypes.string,
          style: PropTypes.object,
          innerClassName: PropTypes.string,
          innerStyle: PropTypes.object,
          content: PropTypes.node,
        })
      ),
    })
  ),
};

// Default Props
Grid.defaultProps = {
  title: 'Grid Layout',
  rows: [
    {
      columns: [
        { xs: 12, content: '.col' },
      ],
    },
    {
      columns: [
        { xs: 6, content: '.col-6' },
        { xs: 6, content: '.col-6' },
      ],
    },
  ],
};

export default Grid;
