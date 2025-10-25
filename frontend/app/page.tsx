'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Import existing components from src (JSX) while we incrementally migrate them to TSX
import LogIn from '../src/components/LogIn';
import SignUp from '../src/components/SignUp';
import HotPostsHeader from '../src/components/HotPostsHeader';
import RenderHotPosts from '../src/components/RenderHotPosts';

export default function Page(): JSX.Element {
  const [status, setStatus] = useState<'LogIn' | 'SignUp'>('LogIn');

  return (
    <div>
      <Container style={{ height: 'calc(100vh - 75px)' }}>
        <Row>
          <Col xs={12} md={6}
               style={{
                 borderLeft: '2px solid #c9f5ff',
                 borderRight: '1px solid #c9f5ff',
                 height: 'calc(100vh - 76px)'
               }}>
            {status === 'LogIn' ? (
              <LogIn switchToSignUp={() => setStatus('SignUp')} />
            ) : (
              <SignUp switchToLogIn={() => setStatus('LogIn')} />
            )}
          </Col>
          <Col xs={12} md={6} style={{ height: 'calc(100vh - 76px)', overflowY: 'auto' }}>
            <HotPostsHeader />
            <RenderHotPosts />
          </Col>
        </Row>
      </Container>
    </div>
  );
}