import {
  Html,
  Head,
  Preview,
  Font,
  Body,
  Container,
  Heading,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your email</title>

        
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          fontWeight="400"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
            format: "woff2",
          }}
        />
      </Head>

      <Preview>Verify your email address</Preview>

      <Body style={{ backgroundColor: "#f5f5f5", margin: 0, padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "8px",
            fontFamily: "Roboto, Verdana, sans-serif",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <Heading
            style={{
              color: "#333333",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Verify Your Email Address
          </Heading>

          <Text
            style={{
              color: "#555555",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            Hi {username},
          </Text>

          <Text
            style={{
              color: "#555555",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            Thank you for registering! Please use the following One-Time Password (OTP)
            to verify your email address:
          </Text>

          <Section
            style={{
              backgroundColor: "#f0f0f0",
              padding: "16px",
              borderRadius: "6px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <Heading
              style={{
                fontSize: "28px",
                color: "#333333",
                margin: 0,
              }}
            >
              {otp}
            </Heading>
          </Section>

          <Text
            style={{
              color: "#555555",
              fontSize: "14px",
            }}
          >
            This OTP is valid for the next 10 minutes.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
