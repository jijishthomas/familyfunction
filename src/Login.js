import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Card, Layout, Spin, Space, Divider } from 'antd';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loginStep, setLoginStep] = useState(1); // 1: initial, 2: side-select, 3: side-question
  const [familySide, setFamilySide] = useState(null); // 'bride' or 'groom'
  const [askedInitialIds, setAskedInitialIds] = useState(new Set());
  const [questionTrigger, setQuestionTrigger] = useState(0);
  const [form] = Form.useForm();

  const questions = {
    initial: [
      { id: 'i1', text: "What was the color of Uncle Bob's famously loud shirt?", answer: 'neon green' },
      { id: 'i2', text: 'What song did everyone get tired of hearing?', answer: 'baby shark' },
      { id: 'i3', text: "Who won the 'most competitive' game of charades?", answer: 'grandma' },
    ],
    bride: [
      { id: 'b1', text: "What is the bride's childhood nickname?", answer: 'chikkus' },
      { id: 'b2', text: "What city was the bride born in?", answer: 'kuzhikala' },
      { id: 'b3', text: "Which part does bride sing in choir?", answer: 'alto' },
    ],
    groom: [
      { id: 'g1', text: "What is the groom's favourite tools company?", answer: 'stanley' },
      { id: 'g2', text: "What was the groom's favourite engine oil brand?", answer: 'shell' },
      { id: 'g3', text: "What was the groom's preferred bike brand?", answer: 'honda' },
    ]
  };

  useEffect(() => {
    // Select a question based on the current step
    let questionPool = [];
    let isInitialStep = false;
    if (loginStep === 1) {
      isInitialStep = true;
      questionPool = questions.initial.filter(q => !askedInitialIds.has(q.id));
    } else if (loginStep === 3 && familySide) {
      questionPool = questions[familySide];
    }

    if (questionPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * questionPool.length);
      const newQuestion = questionPool[randomIndex];
      setCurrentQuestion(newQuestion);
      if (isInitialStep) {
        setAskedInitialIds(prev => new Set(prev).add(newQuestion.id));
      }
    } else if (isInitialStep && askedInitialIds.size > 0) {
      // All initial questions have been skipped
      setError("That wasn't quite right. Let's try another way.");
      setLoginStep(2);
    }
  }, [loginStep, familySide, questionTrigger]);

  const loginSuccess = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  const onFinish = (values) => {
    const isCorrect = currentQuestion && values.question.toLowerCase().trim() === currentQuestion.answer.toLowerCase();

    if (isCorrect) {
      loginSuccess();
    } else {
      if (loginStep === 1) {
        // Failed initial question, move to step 2
        setError("That wasn't quite right. Let's try another way.");
        setAskedInitialIds(new Set()); // Reset for a clean state
        setLoginStep(2);
      } else {
        // Failed second question
        setError('Sorry, that is incorrect. Please try again later.');
      }
    }
  };

  const handleSideSelection = (side) => {
    setFamilySide(side);
    setLoginStep(3);
    setAskedInitialIds(new Set()); // Reset for a clean state
    setError(''); // Clear previous error
    form.resetFields();
  };

  const handleSkip = () => {
    setError('');
    setQuestionTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    if (loginStep === 1 && !currentQuestion) {
      return <Spin size="large" />;
    }

    if (loginStep === 2) {
      return (
        <>
          <Typography.Text type="secondary">Are you with the bride or groom's family?</Typography.Text>
          <Divider />
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button size="large" onClick={() => handleSideSelection('bride')}>Bride's Side</Button>
            <Button size="large" onClick={() => handleSideSelection('groom')}>Groom's Side</Button>
          </Space>
        </>
      );
    }

    if ((loginStep === 1 || loginStep === 3) && currentQuestion) {
      return (
        <Form
          name="loginForm"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={currentQuestion.text}
            name="question"
            rules={[{ required: true, message: 'Please answer the question!' }]}
          >
            <Input placeholder="Your Answer" size="large" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" size="large" style={{ flex: 1 }}>
                Enter
              </Button>
              <Button onClick={handleSkip} size="large" style={{ flex: 1 }}>Skip Question</Button>
            </Space>
          </Form.Item>
        </Form>
      );
    }

    return null;
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>Family Album Access</Title>
          <Typography.Text type="secondary">Please answer the question to continue</Typography.Text>
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}
        {renderContent()}
      </Card>
    </Layout>
  );
}


export default Login;