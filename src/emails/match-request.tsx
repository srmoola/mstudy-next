import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MatchRequestEmailProps {
  receiverName: string;
  requesterName: string;
  courseName: string;
  respondUrl: string;
}

export default function MatchRequestEmail({
  receiverName,
  requesterName,
  courseName,
  respondUrl,
}: MatchRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {requesterName} wants to study with you in {courseName}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <div style={logoBox}>M</div>
            <Heading style={heading}>New study partner request</Heading>
          </Section>
          <Section style={contentSection}>
            <Text style={paragraph}>Hi {receiverName},</Text>
            <Text style={paragraph}>
              <strong>{requesterName}</strong> wants to be your study partner in{" "}
              <strong>{courseName}</strong>! Review their request and decide if
              you&apos;d like to connect.
            </Text>
            <Section style={buttonContainer}>
              <Link href={respondUrl} style={button}>
                View request
              </Link>
            </Section>
            <Text style={smallText}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>{respondUrl}</Text>
            <Hr style={hr} />
            <Text style={footer}>
              You&apos;re receiving this because someone on MStudy wants to
              study with you. You can accept or decline the request.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  color: "#00274C",
};

const logoSection = {
  textAlign: "center" as const,
  padding: "40px 20px 20px",
};

const logoBox = {
  display: "inline-block",
  background: "linear-gradient(135deg, #00274C, #FFCB05)",
  borderRadius: "16px",
  width: "50px",
  height: "50px",
  lineHeight: "50px",
  color: "white",
  fontWeight: 900,
  fontSize: "24px",
  textAlign: "center" as const,
};

const heading = {
  marginTop: "16px",
  fontSize: "24px",
  fontWeight: 800,
  color: "#00274C",
};

const contentSection = {
  padding: "0 24px 40px",
};

const paragraph = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "1.6",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  display: "inline-block",
  background: "linear-gradient(to right, #00274C, #FFCB05)",
  color: "white",
  fontWeight: 600,
  fontSize: "16px",
  padding: "14px 32px",
  borderRadius: "50px",
  textDecoration: "none",
};

const smallText = {
  fontSize: "14px",
  color: "#94a3b8",
  lineHeight: "1.6",
};

const linkText = {
  fontSize: "14px",
  color: "#00274C",
  wordBreak: "break-all" as const,
};

const hr = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "32px 0",
};

const footer = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center" as const,
};
